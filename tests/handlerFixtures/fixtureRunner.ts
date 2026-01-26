/* eslint-disable @typescript-eslint/no-explicit-any */
/* tests/handlerFixtures/fixtureRunner.ts */
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
function matchSubset(expected: unknown, actual: unknown, path = '$'): void {
	// Primitive / null / undefined
	if (!isPlainObject(expected) && !Array.isArray(expected)) {
		expect(actual).toEqual(expected);
		return;
	}

	// Array
	if (Array.isArray(expected)) {
		expect(Array.isArray(actual)).toBe(true);
		const act = actual as unknown[];
		expect(act.length).toBeGreaterThanOrEqual(expected.length);
		for (let i = 0; i < expected.length; i++) {
			matchSubset(expected[i], act[i], `${path}[${i}]`);
		}
		return;
	}

	// Plain object
	expect(isPlainObject(actual)).toBe(true);
	const act = actual as Record<string, unknown>;
	for (const [k, v] of Object.entries(expected as Record<string, unknown>)) {
		expect(Object.prototype.hasOwnProperty.call(act, k)).toBe(true);
		matchSubset(v, act[k], `${path}.${k}`);
	}
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
			matchSubset(expected, actual);
		} catch (e) {
			throw new Error(
				`helpers.httpRequest() did not match fixture expectation.\n` +
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
