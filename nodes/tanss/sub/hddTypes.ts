import {
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import {
	generateAPIEndpointURL,
	getNodeParameter,
	nonEmptyRecordGuard,
	nonEmptyStringGuard,
	numberGuard,
	addAuthorizationHeader,
	obtainToken,
	httpRequest,
} from '../lib';

export const hddTypesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['hddTypes'] } },
		options: [
			{
				name: 'Create HDD Type',
				value: 'createHddType',
				description: 'Creates a new hdd type',
				action: 'Create an HDD type',
			},
			{
				name: 'Delete HDD Type',
				value: 'deleteHddType',
				description: 'Deletes a hdd type',
				action: 'Delete an HDD type',
			},
			{
				name: 'Get All HDD Types',
				value: 'getAllHddTypes',
				description: 'Gets a list of all hdd types',
				action: 'Get all HDD types',
			},
			{
				name: 'Get HDD Type',
				value: 'getHddTypeById',
				description: 'Gets a specific hdd type',
				action: 'Get an HDD type',
			},
			{
				name: 'Update HDD Type',
				value: 'updateHddType',
				description: 'Updates an existing hdd type',
				action: 'Update an HDD type',
			},
		],
		default: 'getAllHddTypes',
	},
];

export const hddTypesFields: INodeProperties[] = [
	{
		displayName: 'HDD Type ID',
		name: 'hddTypeId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the HDD type',
		displayOptions: {
			show: {
				resource: ['hddTypes'],
				operation: ['updateHddType', 'getHddTypeById', 'deleteHddType'],
			},
		},
	},
	{
		displayName: 'Create HDD Type Fields',
		name: 'createHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['createHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update HDD Type Fields',
		name: 'updateHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['updateHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export async function handleHddTypes(this: IExecuteFunctions, i: number) {
	const operation = getNodeParameter(this, 'operation', i, '', nonEmptyStringGuard);
	const apiToken = await obtainToken(this, await this.getCredentials('tanssApi'));
	const hddTypeId = getNodeParameter(this, 'hddTypeId', i, 0, numberGuard);

	let subPath: string | undefined;
	let method: IHttpRequestMethods | undefined;
	let body: Record<string, unknown> | undefined;

	switch (operation) {
		case 'createHddType': {
			subPath = 'hddTypes';
			method = 'POST';
			body = getNodeParameter<Record<string, unknown>>(
				this,
				'createHddTypeFields',
				i,
				{},
				nonEmptyRecordGuard,
			);
			break;
		}
		case 'deleteHddType': {
			subPath = `hddTypes/${hddTypeId}`;
			method = 'DELETE';
			break;
		}
		case 'getAllHddTypes': {
			subPath = 'hddTypes';
			method = 'GET';
			break;
		}
		case 'getHddTypeById': {
			subPath = `hddTypes/${hddTypeId}`;
			method = 'GET';
			break;
		}
		case 'updateHddType': {
			subPath = `hddTypes/${hddTypeId}`;
			method = 'PUT';
			body = getNodeParameter<Record<string, unknown>>(
				this,
				'updateHddTypeFields',
				i,
				{},
				nonEmptyRecordGuard,
			);
			break;
		}
		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized for HDD Types.`,
			);
	}
	if (!subPath || !method) {
		throw new NodeOperationError(
			this.getNode(),
			'Failed to determine API endpoint or method for the HDD Types operation.',
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
