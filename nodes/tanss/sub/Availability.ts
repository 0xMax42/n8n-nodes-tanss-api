import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import {
	addAuthorizationHeader,
	obtainToken,
	addQueryParams,
	generateAPIEndpointURL,
	getNodeParameter,
	nonEmptyStringGuard,
	httpRequest,
} from '../lib';

export const availabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['availability'] } },
		options: [
			{
				name: 'Get Availability',
				value: 'getAvailability',
				description: 'Fetch availability information for employees',
				action: 'Get availability',
			},
		],
		default: 'getAvailability',
	},
];

export const availabilityFields: INodeProperties[] = [
	{
		displayName: 'Employee IDs (Comma Separated)',
		name: 'employeeIds',
		type: 'string' as const,
		required: true,
		default: '',
		description: 'Comma-separated list of employee IDs to fetch availability for',
		displayOptions: { show: { resource: ['availability'], operation: ['getAvailability'] } },
	},
];

export async function handleAvailability(this: IExecuteFunctions, i: number) {
	const apiToken = await obtainToken(this, await this.getCredentials('tanssApi'));
	const url = generateAPIEndpointURL(
		this,
		(await this.getCredentials('tanssApi'))?.baseURL,
		'availability',
	);

	const employeeIds = getNodeParameter(this, 'employeeIds', i, '', nonEmptyStringGuard);

	const requestOptions: IHttpRequestOptions = {
		method: 'GET',
		headers: { Accept: 'application/json' },
		json: true,
		url,
	};
	addAuthorizationHeader(requestOptions, apiToken);
	addQueryParams(requestOptions, { employeeIds: employeeIds });

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
				`Network error while executing getAvailability: ${response.body}`,
			);
	}
}
