/* tests/handlerFixtures/fixtureTypes.ts */

/**
 * A single expected httpRequest call.
 * The runner will consume these in order (queue semantics).
 */
export type HttpMock =
	| {
			/** A partial matcher for the request options passed to helpers.httpRequest() */
			expect: Partial<{
				method: string;
				url: string;
				json: boolean;
				body: unknown;
				headers: Record<string, unknown>;
			}>;

			/** Return a value (resolved Promise) from helpers.httpRequest() */
			reply: unknown;
	  }
	| {
			expect: Partial<{
				method: string;
				url: string;
				json: boolean;
				body: unknown;
				headers: Record<string, unknown>;
			}>;

			/** Throw an error from helpers.httpRequest() */
			throw: {
				kind: 'error' | 'axios';
				/**
				 * For kind=error: message is used for Error(message)
				 * For kind=axios: will throw an axios-like object with response.status/data/headers
				 */
				message?: string;

				/** Only for kind=axios */
				statusCode?: number;
				data?: unknown;
				headers?: Record<string, unknown>;
			};
	  };

export type FixtureExpected =
	| {
			kind: 'returns';
			/** Exact match */
			result?: unknown;
			/** Partial match */
			matchObject?: Record<string, unknown>;
			/** Snapshot match */
			snapshot?: boolean;
	  }
	| {
			kind: 'throws';

			/**
			 * Flat error matchers.
			 * These are evaluated against the thrown error (Error / NodeOperationError etc.).
			 */
			message?: string;
			messageIncludes?: string;
			name?: string;

			/**
			 * Structured matcher (used by fixtures).
			 * Kept to make fixtures more explicit and future-proof.
			 */
			matchError?: {
				name?: string;
				message?: string;
				messageIncludes?: string;
			};
	  };

export type HandlerFixture = {
	/** Human readable name for the test case */
	name: string;

	/** Item index passed to handler(i). Default: 0 */
	itemIndex?: number;

	/**
	 * Parameters returned by getNodeParameter(name, itemIndex, default).
	 *
	 * - If value is an array, runner picks value[itemIndex].
	 * - Otherwise it uses the value as-is.
	 */
	parameters?: Record<string, unknown>;

	/**
	 * Credentials returned by getCredentials('tanssApi') etc.
	 * Example:
	 * { "tanssApi": { "baseURL": "...", "authentication": "apiToken", "apiToken": "..." } }
	 */
	credentials?: Record<string, unknown>;

	/**
	 * Mocked helpers.httpRequest() calls, consumed in order.
	 * Needed for:
	 * - obtainToken() loginTotp (returns { content: { apiKey } })
	 * - httpRequest() wrapper (expects an IN8nHttpFullResponse-like object)
	 */
	http?: HttpMock[];

	/**
	 * Optional: control Date.now() for deterministic TOTP tests.
	 * If provided, Date.now() will be mocked to this value for the fixture.
	 */
	nowMs?: number;

	/**
	 * Optional: extra properties injected into `this`.
	 * Useful if a handler uses additional n8n APIs.
	 */
	injectThis?: Record<string, unknown>;

	expected: FixtureExpected;
};

/**
 * Minimal node metadata used by NodeOperationError.
 */
export type NodeStub = {
	name: string;
	type: string;
	typeVersion?: number;
};
