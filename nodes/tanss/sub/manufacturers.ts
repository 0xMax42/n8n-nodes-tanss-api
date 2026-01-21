import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import {
	addAuthorizationHeader,
	obtainToken,
	generateAPIEndpointURL,
	getNodeParameter,
	nonEmptyRecordGuard,
	nonEmptyStringGuard,
	numberGuard,
	httpRequest,
} from '../lib';

export const manufacturersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['manufacturers'] } },
		options: [
			{
				name: 'Create Manufacturer',
				value: 'createManufacturer',
				description: 'Creates a new manufacturer',
				action: 'Create a manufacturer',
			},
			{
				name: 'Delete Manufacturer',
				value: 'deleteManufacturer',
				description: 'Deletes a manufacturer',
				action: 'Delete a manufacturer',
			},
			{
				name: 'Get All Manufacturers',
				value: 'getAllManufacturers',
				description: 'Gets a list of all manufacturers',
				action: 'Get all manufacturers',
			},
			{
				name: 'Get Manufacturer',
				value: 'getManufacturerById',
				description: 'Gets a specific manufacturer',
				action: 'Get a manufacturer',
			},
			{
				name: 'Update Manufacturer',
				value: 'updateManufacturer',
				description: 'Updates an existing manufacturer',
				action: 'Update a manufacturer',
			},
		],
		default: 'getAllManufacturers',
	},
];

export const manufacturersFields: INodeProperties[] = [
	{
		displayName: 'Manufacturer ID',
		name: 'manufacturerId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the manufacturer',
		displayOptions: {
			show: {
				resource: ['manufacturers'],
				operation: ['updateManufacturer', 'getManufacturerById', 'deleteManufacturer'],
			},
		},
	},
	{
		displayName: 'Create Manufacturer Fields',
		name: 'createManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['createManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update Manufacturer Fields',
		name: 'updateManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['updateManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export async function handleManufacturers(this: IExecuteFunctions, i: number) {
	const operation = getNodeParameter(this, 'operation', i, '', nonEmptyStringGuard);
	const apiToken = await obtainToken(this, await this.getCredentials('tanssApi'));
	const manufacturerId = getNodeParameter(this, 'manufacturerId', i, 0, numberGuard);

	let subPath: string | undefined;
	let method: IHttpRequestMethods | undefined;
	let body: Record<string, unknown> | undefined;

	switch (operation) {
		case 'createManufacturer': {
			subPath = 'manufacturers';
			method = 'POST';
			body = getNodeParameter<Record<string, unknown>>(
				this,
				'createManufacturerFields',
				i,
				{},
				nonEmptyRecordGuard,
			);
			break;
		}
		case 'deleteManufacturer': {
			subPath = `manufacturers/${manufacturerId}`;
			method = 'DELETE';
			break;
		}
		case 'getAllManufacturers': {
			subPath = 'manufacturers';
			method = 'GET';
			break;
		}
		case 'getManufacturerById': {
			subPath = `manufacturers/${manufacturerId}`;
			method = 'GET';
			break;
		}
		case 'updateManufacturer': {
			subPath = `manufacturers/${manufacturerId}`;
			method = 'PUT';
			body = getNodeParameter<Record<string, unknown>>(
				this,
				'updateManufacturerFields',
				i,
				{},
				nonEmptyRecordGuard,
			);
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for Manufacturers.`,
			);
	}

	if (!subPath || !method) {
		throw new NodeOperationError(
			this.getNode(),
			'Failed to determine API endpoint or method for the Manufacturers operation.',
		);
	}

	const url = generateAPIEndpointURL(
		this,
		(await this.getCredentials('tanssApi'))?.baseURL,
		subPath,
	);

	const requestOptions: IHttpRequestOptions = {
		method: method,
		headers: { Accept: 'application/json' },
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
}
