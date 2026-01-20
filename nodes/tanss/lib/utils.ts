import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

/**
 * Generates a full API endpoint URL by appending the API postfix and endpoint to the base URL.
 * @param executeFunctions The execution functions context
 * @param baseURL The base URL to which the API postfix path will be appended (e.g., https://example.com)
 * @param endpoint The specific API endpoint to append to the base URL (e.g., 'login', 'data/items')
 * @param apiPostfix The API postfix path to append between the base URL and endpoint (default is 'backend/api/v1')
 * @returns The full API URL
 * @throws The {@link NodeOperationError} exception is thrown if the baseURL is not provided.
 */
export function generateAPIEndpointURL(
	executeFunctions: IExecuteFunctions,
	baseURL: unknown,
	endpoint: string,
	apiPostfix = 'backend/api/v1',
): string {
	if (!baseURL || typeof baseURL !== 'string') {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Base URL is required in credentials!',
		);
	}

	return concatURLAndPath(baseURL, apiPostfix, endpoint);
}

function removeTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '');
}

function removeLeadingSlash(path: string): string {
	return path.replace(/^\/+/, '');
}

function removeBothSlashes(path: string): string {
	return removeLeadingSlash(removeTrailingSlash(path));
}

/**
 * Concatenates a base URL with one or more path segments, ensuring proper slashes.
 * @param url The base URL to which path segments will be appended
 * @param path One or more path segments to append to the base URL
 * @returns The concatenated URL with proper slashes
 */
export function concatURLAndPath(url: string, ...path: string[]): string {
	return `${removeTrailingSlash(url)}/${path.map(removeBothSlashes).join('/')}`;
}

/**
 * Appends a query path to a given URL.
 * @param url The base URL to which the query path will be added
 * @param queryPath The query path to append to the URL
 * @returns The URL with the appended query path
 */
export function addQueryPathToURL(url: string, queryPath: string): string {
	const urlObj = new URL(url);
	urlObj.pathname = concatURLAndPath(urlObj.pathname, queryPath);
	return urlObj.toString();
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

/**
 * Wrapper around n8n's getNodeParameter for reusable handling of typing and validation.
 * @param executeFunctions The execution functions context
 * @param name The name of the parameter to retrieve
 * @param itemIndex The index of the item for which the parameter is retrieved
 * @param defaultValue The default value to use if the parameter is not found
 * @param validator An optional function to validate or transform the retrieved value
 * @returns The retrieved and optionally validated parameter value
 * @throws The {@link NodeOperationError} exception can be thrown by the validator function if validation fails.
 */
export function getNodeParameter<T>(
	executeFunctions: IExecuteFunctions,
	name: string,
	itemIndex: number,
	defaultValue: T,
	validator?: (executeFunctions: IExecuteFunctions, value: T, name: string) => T,
): T {
	const value = executeFunctions.getNodeParameter(name, itemIndex, defaultValue) as T;
	return validator ? validator(executeFunctions, value, name) : value;
}

/**
 * A Validator function that ensures a string parameter is not empty or whitespace only
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The string value to validate
 * @param name The name of the parameter being validated
 * @returns The validated string value
 * @throws The {@link NodeOperationError} exception is thrown if the string is empty or whitespace only.
 */
export function nonEmptyStringGuard(
	executeFunctions: IExecuteFunctions,
	value: string,
	name: string,
): string {
	if (value.trim() === '') {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be empty`);
	}
	return value;
}

/**
 * A Validator function that ensures a number parameter is not zero
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The number value to validate
 * @param name The name of the parameter being validated
 * @returns The validated number value
 * @throws The {@link NodeOperationError} exception is thrown if the number is zero.
 */
export function nonZeroNumberGuard(
	executeFunctions: IExecuteFunctions,
	value: number,
	name: string,
): number {
	if (value === 0) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be zero`);
	}
	return value;
}

/**
 * A Validator function that ensures a record parameter is not empty
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The record value to validate
 * @param name The name of the parameter being validated
 * @returns The validated record value
 * @throws The {@link NodeOperationError} exception is thrown if the record is empty.
 */
export function nonEmptyRecordGuard(
	executeFunctions: IExecuteFunctions,
	value: Record<string, unknown>,
	name: string,
): Record<string, unknown> {
	if (Object.keys(value).length === 0) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be empty`);
	}
	return value;
}
