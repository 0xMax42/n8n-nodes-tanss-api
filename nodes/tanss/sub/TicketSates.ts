import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import {
	addAuthorizationHeader,
	booleanGuard,
	generateAPIEndpointURL,
	getNodeParameter,
	httpRequest,
	nonEmptyStringGuard,
	numberGuard,
	obtainToken,
	stringGuard,
} from '../lib';

export const ticketStatesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
			},
		},
		options: [
			{
				name: 'Get Ticket States',
				value: 'getTicketStates',
				description: 'Gets a list of all ticket states',
				action: 'Get ticket states',
			},
			{
				name: 'Create Ticket State',
				value: 'createTicketState',
				description: 'Creates a new ticket state',
				action: 'Create a ticket state',
			},
			{
				name: 'Update Ticket State',
				value: 'updateTicketState',
				description: 'Updates an existing ticket state',
				action: 'Update a ticket state',
			},
			{
				name: 'Delete Ticket State',
				value: 'deleteTicketState',
				description: 'Deletes a ticket state',
				action: 'Delete a ticket state',
			},
		],
		default: 'getTicketStates',
	},
];

export const ticketStatesFields: INodeProperties[] = [
	// ID field used by update/delete (single fetch removed)
	{
		displayName: 'Ticket State ID',
		name: 'id',
		type: 'number' as const,
		default: 0,
		description: 'ID of the ticket state',
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['updateTicketState', 'deleteTicketState'],
			},
		},
	},
	// Fields for creating or updating a ticket state
	{
		displayName: 'Name',
		name: 'name',
		type: 'string' as const,
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Name of the ticket state',
	},
	{
		displayName: 'Image',
		name: 'image',
		type: 'string' as const,
		default: '',
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Name of the image (must be in folder media/hp/bug_status)',
	},
	{
		displayName: 'Wait State',
		name: 'waitState',
		type: 'boolean' as const,
		default: false,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Determines if this state is a waiting state',
	},
	{
		displayName: 'Rank',
		name: 'rank',
		type: 'number' as const,
		default: 0,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Rank of this state (position in lists)',
	},
	{
		displayName: 'Active',
		name: 'active',
		type: 'boolean' as const,
		default: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: "Is this an active state? (otherwise won't be shown)",
	},
];

export async function handleTicketStates(this: IExecuteFunctions, i: number) {
	const operation = getNodeParameter(this, 'operation', i, '', nonEmptyStringGuard);
	const apiToken = await obtainToken(this, await this.getCredentials('tanssApi'));

	let subPath: string | undefined;
	let method: IHttpRequestMethods | undefined;
	let body: Record<string, unknown> | undefined;

	switch (operation) {
		case 'getTicketStates':
			subPath = 'admin/ticketStates';
			method = 'GET';
			break;

		case 'createTicketState':
			{
				const name = getNodeParameter(this, 'name', i, '', nonEmptyStringGuard);
				const image = getNodeParameter(this, 'image', i, '', stringGuard);
				const waitState = getNodeParameter(this, 'waitState', i, false, booleanGuard);
				const rank = getNodeParameter(this, 'rank', i, 0, numberGuard);
				const active = getNodeParameter(this, 'active', i, true, booleanGuard);

				body = {
					name,
					image,
					waitState,
					rank,
					active,
				};
				subPath = 'admin/ticketStates';
				method = 'POST';
			}
			break;

		case 'updateTicketState':
			{
				const id = getNodeParameter(this, 'id', i, undefined, numberGuard);
				const name = getNodeParameter(this, 'name', i, '', stringGuard);
				const image = getNodeParameter(this, 'image', i, '', stringGuard);
				const waitState = getNodeParameter(this, 'waitState', i, false, booleanGuard);
				const rank = getNodeParameter(this, 'rank', i, 0, numberGuard);
				const active = getNodeParameter(this, 'active', i, true, booleanGuard);

				body = {
					name,
					image,
					waitState,
					rank,
					active,
				};
				subPath = `admin/ticketStates/${id}`;
				method = 'PUT';
			}
			break;

		case 'deleteTicketState':
			{
				const delId = getNodeParameter(this, 'id', i, undefined, numberGuard);
				subPath = `admin/ticketStates/${delId}`;
				method = 'DELETE';
			}
			break;

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	if (!subPath || !method) {
		throw new NodeOperationError(
			this.getNode(),
			'Failed to determine API endpoint or method for the TicketStates operation.',
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
