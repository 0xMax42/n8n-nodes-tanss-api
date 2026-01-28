/* eslint-disable @typescript-eslint/no-explicit-any */
/* tests/handlerFixtures/fixtureRunner.ts */
import { inspect } from 'node:util';
import { HandlerFixture, HttpMock, NodeStub } from './fixtureTypes';

/**
 * Generic handler signature (n8n style): handler.call(thisCtx, itemIndex)
 */
export type AnyNodeHandler = (this: any, i: number) => Promise<unknown>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null) return false;
	if (Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

/**
 * Deep partial matcher: ensures every key/value from `expected` exists in `actual`.
 */
type SubsetDiff =
	| {
			kind: 'type';
			path: string;
			expectedType: string;
			actualType: string;
	  }
	| {
			kind: 'missing-key';
			path: string;
			key: string;
	  }
	| {
			kind: 'array-length';
			path: string;
			expectedMinLength: number;
			actualLength: number;
	  }
	| {
			kind: 'value';
			path: string;
			expected: unknown;
			actual: unknown;
	  };

function typeLabel(value: unknown): string {
	if (value === null) return 'null';
	if (Array.isArray(value)) return 'array';
	return typeof value;
}

function formatValue(value: unknown): string {
	return inspect(value, {
		depth: 10,
		breakLength: 120,
		compact: false,
		sorted: true,
	});
}

function collectSubsetDiffs(
	expected: unknown,
	actual: unknown,
	path: string,
	diffs: SubsetDiff[],
): void {
	// Array
	if (Array.isArray(expected)) {
		if (!Array.isArray(actual)) {
			diffs.push({
				kind: 'type',
				path,
				expectedType: 'array',
				actualType: typeLabel(actual),
			});
			return;
		}

		if (actual.length < expected.length) {
			diffs.push({
				kind: 'array-length',
				path,
				expectedMinLength: expected.length,
				actualLength: actual.length,
			});
			// Still compare what we can
		}

		for (let i = 0; i < expected.length; i++) {
			collectSubsetDiffs(expected[i], (actual as unknown[])[i], `${path}[${i}]`, diffs);
		}
		return;
	}

	// Plain object
	if (isPlainObject(expected)) {
		if (!isPlainObject(actual)) {
			diffs.push({
				kind: 'type',
				path,
				expectedType: 'object',
				actualType: typeLabel(actual),
			});
			return;
		}

		const act = actual as Record<string, unknown>;
		for (const [k, v] of Object.entries(expected as Record<string, unknown>)) {
			if (!Object.prototype.hasOwnProperty.call(act, k)) {
				diffs.push({ kind: 'missing-key', path, key: k });
				continue;
			}
			collectSubsetDiffs(v, act[k], `${path}.${k}`, diffs);
		}
		return;
	}

	// Primitive / null / undefined
	if (!Object.is(expected, actual)) {
		diffs.push({ kind: 'value', path, expected, actual });
	}
}

function assertSubsetOrThrow(expected: unknown, actual: unknown): void {
	const diffs: SubsetDiff[] = [];
	collectSubsetDiffs(expected, actual, '$', diffs);

	if (diffs.length === 0) return;

	const max = 25;
	const rendered = diffs.slice(0, max).map((d) => {
		switch (d.kind) {
			case 'type':
				return `- ${d.path}: expected type ${d.expectedType}, got ${d.actualType}`;
			case 'missing-key':
				return `- ${d.path}: missing key ${JSON.stringify(d.key)}`;
			case 'array-length':
				return `- ${d.path}: expected array length >= ${d.expectedMinLength}, got ${d.actualLength}`;
			case 'value':
				return (
					`- ${d.path}: value mismatch\n` +
					`    expected: ${formatValue(d.expected)}\n` +
					`    actual:   ${formatValue(d.actual)}`
				);
		}
	});

	const more = diffs.length > max ? `\n...and ${diffs.length - max} more differences.` : '';
	throw new Error(`Subset mismatch (${diffs.length} differences):\n${rendered.join('\n')}${more}`);
}

/**
 * Build a predictable Node stub for NodeOperationError().
 */
function defaultNode(): NodeStub {
	return { name: 'fixture-node', type: 'fixture.node', typeVersion: 1 };
}

function pickParamValue(value: unknown, itemIndex: number): unknown {
	if (Array.isArray(value)) return value[itemIndex];
	return value;
}

function buildHttpRequestMock(queue: HttpMock[]) {
	const calls: unknown[] = [];

	const fn = async (options: any) => {
		calls.push(options);

		const next = queue.shift();
		if (!next) {
			throw new Error(
				`Unexpected helpers.httpRequest() call (no more http mocks left). Options: ${JSON.stringify(
					options,
					null,
					2,
				)}`,
			);
		}

		// Validate request partially (only what fixture specifies)
		const expected = { ...(next.expect ?? {}) } as Record<string, unknown>;
		if ('returnFullResponse' in expected) delete expected.returnFullResponse;
		try {
			const actual = { ...(options as Record<string, unknown>) } as Record<string, unknown>;
			assertSubsetOrThrow(expected, actual);
		} catch (e) {
			throw new Error(
				`helpers.httpRequest() did not match fixture expectation.\n` +
					`Differences:\n${(e as Error).message}\n` +
					`Expected subset: ${JSON.stringify(expected, null, 2)}\n` +
					`Actual options:   ${JSON.stringify(options, null, 2)}\n` +
					`Original error: ${(e as Error).message}`,
			);
		}

		if ('reply' in next) return next.reply;

		// Throw
		if (next.throw.kind === 'error') {
			throw new Error(next.throw.message ?? 'Mocked error');
		}

		// Axios-like
		throw {
			response: {
				status: next.throw.statusCode ?? 500,
				data: next.throw.data,
				headers: next.throw.headers ?? {},
			},
		};
	};

	return { fn, calls };
}

/**
 * Create a "this" context compatible with the provided handlers.
 * Only the methods used by your current code are implemented.
 */
export function createExecuteFunctionsFixtureContext(fixture: HandlerFixture) {
	const itemIndex = fixture.itemIndex ?? 0;
	const node = defaultNode();

	const httpQueue = [...(fixture.http ?? [])]; // copy
	const { fn: httpRequestFn, calls: httpCalls } = buildHttpRequestMock(httpQueue);

	const ctx: any = {
		// Node metadata for NodeOperationError
		getNode: () => node,

		// n8n parameter access
		getNodeParameter: (name: string, i: number, defaultValue?: unknown) => {
			const params = fixture.parameters ?? {};
			if (!Object.prototype.hasOwnProperty.call(params, name)) return defaultValue;
			return pickParamValue(params[name], i);
		},

		// n8n credentials access
		getCredentials: async (name: string) => {
			const creds = fixture.credentials ?? {};
			return (creds as any)[name];
		},

		// n8n helpers
		helpers: {
			httpRequest: httpRequestFn,
		},

		// Allow additional DI through `this`
		...(fixture.injectThis ?? {}),
	};

	return { ctx, itemIndex, httpQueue, httpCalls };
}

/**
 * Execute a handler against a single fixture and assert result/throw.
 * Returns some debug info for additional assertions.
 */
export async function runHandlerFixture(handler: AnyNodeHandler, fixture: HandlerFixture) {
	// Deterministic time (for generateTOTP)
	const dateNowSpy = fixture.nowMs !== undefined ? jest.spyOn(Date, 'now') : undefined;
	if (dateNowSpy) dateNowSpy.mockReturnValue(fixture.nowMs!);

	const { ctx, itemIndex, httpQueue, httpCalls } = createExecuteFunctionsFixtureContext(fixture);

	try {
		if (fixture.expected.kind === 'throws') {
			const p = handler.call(ctx, itemIndex);

			// Support both flat and structured matchers.
			const spec =
				'matchError' in fixture.expected && fixture.expected.matchError
					? fixture.expected.matchError
					: fixture.expected;

			// Assert thrown message
			if (spec.message) {
				await expect(p).rejects.toThrow(spec.message);
			} else if (spec.messageIncludes) {
				await expect(p).rejects.toThrow(spec.messageIncludes);
			} else {
				await expect(p).rejects.toThrow();
			}

			// Assert thrown error name/type (NodeOperationError etc.)
			if (spec.name) {
				await p.catch((e) => {
					expect((e as any)?.name).toBe(spec.name);
				});
			}

			// For "throw before http" fixtures: ensure no http mocks remain (and no unexpected calls happened).
			expect(httpQueue.length).toBe(0);

			return { ctx, httpCalls, remainingHttpMocks: httpQueue.length };
		}

		// returns
		const result = await handler.call(ctx, itemIndex);

		if (fixture.expected.snapshot) {
			expect(result).toMatchSnapshot();
		}

		if (fixture.expected.matchObject) {
			expect(result).toMatchObject(fixture.expected.matchObject);
		}

		if ('result' in fixture.expected) {
			// Explicit "result: undefined" should assert undefined
			expect(result).toEqual(fixture.expected.result);
		}

		// Ensure all planned http mocks were consumed (helps catching "missing requests")
		expect(httpQueue.length).toBe(0);

		return { ctx, httpCalls, remainingHttpMocks: httpQueue.length, result };
	} finally {
		if (dateNowSpy) dateNowSpy.mockRestore();
	}
}

/**
 * Jest convenience wrapper: define a test suite for a handler with fixtures.
 */
export function defineHandlerFixtureSuite(
	title: string,
	handler: AnyNodeHandler,
	fixtures: HandlerFixture[],
) {
	describe(title, () => {
		test.each(fixtures.map((f) => [f.name, f] as const))('%s', async (_name, fixture) => {
			await runHandlerFixture(handler, fixture);
		});
	});
}
