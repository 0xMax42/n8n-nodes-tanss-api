import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { NodeParameterGuard } from './guards';

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
 * Wrapper around n8n's getNodeParameter for reusable handling of typing and validation.
 * @param executeFunctions The execution functions context
 * @param name The name of the parameter to retrieve
 * @param itemIndex The index of the item for which the parameter is retrieved
 * @param defaultValue The default value to use if the parameter is not found
 * @param validator A function to validate or transform the retrieved value
 * @returns The retrieved and optionally validated parameter value
 * @throws The {@link NodeOperationError} exception can be thrown by the validator function if validation fails.
 */
export function getNodeParameter<T>(
	executeFunctions: IExecuteFunctions,
	name: string,
	itemIndex: number,
	defaultValue: T | undefined,
	guard: NodeParameterGuard<T>,
): T {
	const value = executeFunctions.getNodeParameter(name, itemIndex, defaultValue) as T;
	return guard ? guard(executeFunctions, value, name) : value;
}
