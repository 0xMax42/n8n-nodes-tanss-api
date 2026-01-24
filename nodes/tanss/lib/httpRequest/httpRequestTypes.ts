/**
 * The result of an HTTP request made via `httpRequestSafe`.
 */
export type HttpResult<T = unknown, F = unknown> =
	| {
			kind: 'success';
			statusCode: number;
			body: T;
			headers?: Record<string, unknown>;
	  }
	| {
			kind: 'http-error';
			statusCode: number;
			body: F | undefined;
			headers?: Record<string, unknown>;
	  }
	| {
			kind: 'network-error';
			statusCode: 0;
			body: string;
	  };
