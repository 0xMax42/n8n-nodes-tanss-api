import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

/**
 * Generates a full API endpoint URL by appending the API postfix and endpoint to the base URL.
 * @param executeFunctions The execution functions context
 * @param baseURL The base URL to which the API postfix path will be appended (e.g., https://example.com)
 * @param endpoint The specific API endpoint to append to the base URL (e.g., 'login', 'data/items')
 * @returns The full API URL
 * @throws The {@link NodeOperationError} exception is thrown if the baseURL is not provided.
 */
export function generateAPIEndpointURL(
	executeFunctions: IExecuteFunctions,
	baseURL: unknown,
	endpoint: string,
): string {
	if (!baseURL || typeof baseURL !== 'string') {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Base URL is required in credentials!',
		);
	}

	return `${baseURL.replace(/\/+$/, '')}/backend/api/v1/${endpoint.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

/**
 * Adds query parameters to a given URL.
 * @param url The base URL to which query parameters will be added
 * @param queryParams An object representing the query parameters to add
 * @returns The URL with the added query parameters; Values are URL-encoded
 */
function addQueryParamsToURL(
	url: string,
	queryParams: Record<string, string | number | boolean>,
): string {
	const urlObj = new URL(url);
	Object.entries(queryParams).forEach(([key, value]) => {
		urlObj.searchParams.append(key, encodeURIComponent(String(value)));
	});
	return urlObj.toString();
}

/**
 * Adds query parameters to the request options URL.
 * @param requestOptions The request options object containing the URL
 * @param queryParams An object representing the query parameters to add
 * @returns void; The requestOptions.url is modified in place
 * Added query parameters are URL-encoded
 */
export function addQueryParams(
	requestOptions: { url: string },
	queryParams: Record<string, string | number | boolean>,
): void {
	requestOptions.url = addQueryParamsToURL(requestOptions.url, queryParams);
}
