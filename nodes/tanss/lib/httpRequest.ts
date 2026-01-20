import { IExecuteFunctions, IHttpRequestOptions, IN8nHttpFullResponse } from 'n8n-workflow';

/**
 * The result of an HTTP request made via `httpRequestSafe`.
 */
export type HttpResult<T = unknown> =
	| {
			kind: 'success';
			statusCode: number;
			body: T;
			headers?: Record<string, unknown>;
	  }
	| {
			kind: 'http-error';
			statusCode: number;
			body: unknown;
			headers?: Record<string, unknown>;
	  }
	| {
			kind: 'network-error';
			statusCode: 0;
			body: string;
	  };

/**
 * A safe wrapper around the n8n httpRequest helper that captures errors and returns them as part of the result.
 * @param executeFunction The execution context containing the httpRequest helper
 * @param options The HTTP request options
 * @returns A promise that resolves to an HttpResult
 * @throws This function does not throw; all errors are captured in the returned HttpResult.
 */
export async function httpRequest<T = unknown>(
	executeFunction: IExecuteFunctions,
	options: IHttpRequestOptions,
): Promise<HttpResult<T>> {
	const opts: IHttpRequestOptions = {
		...options,
		returnFullResponse: true,
	};

	try {
		// Without an error, we can assume it's a full response
		const res = (await executeFunction.helpers.httpRequest(opts)) as IN8nHttpFullResponse;

		return {
			kind: 'success',
			statusCode: res.statusCode,
			body: res.body as T,
			headers: res.headers,
		};
	} catch (err: unknown) {
		// Axios-style HTTP error
		if (
			typeof err === 'object' &&
			err !== null &&
			'response' in err &&
			typeof err.response === 'object' &&
			err.response !== null &&
			'status' in err.response &&
			typeof err.response.status === 'number'
		) {
			return {
				kind: 'http-error',
				statusCode: err.response.status,
				body: 'data' in err.response ? err.response.data : undefined,
				headers:
					'headers' in err.response &&
					typeof err.response.headers === 'object' &&
					err.response.headers !== null
						? (err.response.headers as Record<string, unknown>)
						: undefined,
			};
		}

		// Network / DNS / TLS / runtime error
		if (err instanceof Error) {
			return {
				kind: 'network-error',
				statusCode: 0,
				body: err.message,
			};
		}

		return {
			kind: 'network-error',
			statusCode: 0,
			body: String(err),
		};
	}
}
