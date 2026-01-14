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
	baseURL: string,
	endpoint: string,
): string {
	if (!baseURL) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			'Base URL is required in credentials!',
		);
	}

	return `${baseURL.replace(/\/+$/, '')}/backend/api/v1/${endpoint.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}
