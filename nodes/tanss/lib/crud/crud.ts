import { IExecuteFunctions, IHttpRequestOptions, NodeOperationError } from 'n8n-workflow';
import {
	CrudFieldLocation,
	CrudFieldMap,
	CrudOperation,
	CrudOperationsConfig,
	NodeHandler,
} from './crudTypes';
import { generateAPIEndpointURL, getNodeParameter } from '../utils';
import { addAuthorizationHeader, obtainToken } from '../token/token';
import { httpRequest } from '../httpRequest/httpRequest';
import { nonEmptyStringGuard } from '../guards';

/**
 * Creates a CRUD handler function for n8n nodes based on the provided configuration.
 * @param config The CRUD operations configuration
 * @returns A node handler function to process CRUD operations
 * @example
 * ```ts
 * export const handleAvailability = createCrudHandler({
 *   operationField: 'operation',
 *   operations: {
 *     getAvailability: {
 *       fields: {
 *         employeeIds: {
 *           location: 'query',
 *           defaultValue: '',
 *           validator: nonEmptyStringGuard,
 *         },
 *       },
 *       httpMethod: 'GET',
 *       subPath: 'availability',
 *     },
 *   },
 * });
 * ```
 */
export function createCrudHandler(config: CrudOperationsConfig): NodeHandler {
	return async function handleCrud(this: IExecuteFunctions, i: number) {
		const operation = getNodeParameter(this, config.operationField, i, '', nonEmptyStringGuard);

		const localConfig = getLocalConfigByOperation.call(this, config, operation);
		const method = localConfig.httpMethod;
		let subPath = localConfig.subPath;
		const body = createRecordFromFields.call(this, localConfig.fields, i, 'body');
		const queryParams = createRecordFromFields.call(this, localConfig.fields, i, 'query');
		const pathParams = createRecordFromFields.call(this, localConfig.fields, i, 'path');

		if (pathParams) {
			for (const [key, value] of Object.entries(pathParams)) {
				subPath = subPath.replace(`{${key}}`, encodeURIComponent(String(value)));
			}
		}

		if (queryParams) {
			const queryString = new URLSearchParams();
			for (const [key, value] of Object.entries(queryParams)) {
				queryString.append(key, String(value));
			}
			subPath += `?${queryString.toString()}`;
		}

		if (!subPath || !method) {
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not properly configured.`,
			);
		}

		const url = generateAPIEndpointURL(
			this,
			(await this.getCredentials('tanssApi'))?.baseURL,
			subPath,
			localConfig.basePath,
		);

		const apiToken = await obtainToken(
			this,
			await this.getCredentials('tanssApi'),
			config.credentialType,
		);

		const headers: Record<string, string> = {};

		if (body) {
			headers['Content-Type'] = 'application/json';
		}

		const requestOptions: IHttpRequestOptions = {
			method: method,
			headers: headers,
			json: true,
			url: url,
			body: body,
			returnFullResponse: true,
		};
		addAuthorizationHeader(requestOptions, apiToken);

		const response = await httpRequest(this, requestOptions);

		switch (response.kind) {
			case 'success':
				return {
					success: true,
					statusCode: response.statusCode,
					message: 'Operation executed successfully',
					body: response.body,
				};
			case 'http-error':
				return {
					success: false,
					statusCode: response.statusCode,
					message: 'HTTP error occurred during operation',
					body: response.body,
				};
			case 'network-error':
				throw new NodeOperationError(
					this.getNode(),
					`Network error while executing ${operation}: ${response.body}`,
				);
		}
	};
}

/**
 * Retrieves the local configuration for a specific CRUD operation.
 * @param config The overall CRUD operations configuration
 * @param operation The operation name to find the configuration for
 * @returns The local configuration for the specified operation
 * @throws NodeOperationError if the operation is not recognized
 */
function getLocalConfigByOperation(
	this: IExecuteFunctions,
	config: CrudOperationsConfig,
	operation: string,
): CrudOperation {
	for (const [key, op] of Object.entries(config.operations)) {
		if (key === operation) {
			return op;
		}
	}

	throw new NodeOperationError(this.getNode(), `The operation "${operation}" is not recognized.`);
}

/**
 * Creates a record from the node parameters based on the specified field location.
 * @param fields The CRUD fields to extract values from
 * @param i The item index
 * @param type The location type to filter fields by ('query', 'path', or 'body')
 * @returns A record containing the parameter values for the specified location, or undefined if none
 */
function createRecordFromFields(
	this: IExecuteFunctions,
	fields: CrudFieldMap,
	i: number,
	type: CrudFieldLocation,
): Record<string, unknown> | unknown[] | undefined {
	const record: Record<string, unknown> = {};
	for (const [key, field] of Object.entries(fields)) {
		if (field.location !== type) continue;
		const value = getNodeParameter(this, key, i, field.defaultValue, field.guard);
		const recordKey = field.locationName ?? key;
		if (field.spread) {
			if (Array.isArray(value)) {
				// For arrays, we cannot spread into the parent object, so return the array itself
				return value;
			} else if (typeof value === 'object' && value !== null) {
				for (const [key, field] of Object.entries(value as Record<string, unknown>)) {
					record[key] = record[key] ? record[key] : field;
				}
				continue;
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Field "${key}" is marked to be spread but its value is not an object.`,
				);
			}
		}
		record[recordKey] = value;
	}
	return Object.keys(record).length > 0 ? record : undefined;
}
