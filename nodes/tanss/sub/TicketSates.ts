import { INodeProperties } from 'n8n-workflow';
import { booleanGuard, nonEmptyStringGuard, numberGuard, stringGuard } from '../lib';
import { createCrudHandler, crudField, crudOperation } from '../lib/crud';

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

export const handleTicketStates = createCrudHandler({
	operationField: {
		name: 'operation',
	},
	operations: [
		crudOperation({
			type: 'read',
			operationName: 'getTicketStates',
			fields: [],
			httpMethod: 'GET',
			subPath: 'admin/ticketStates',
		}),
		crudOperation({
			type: 'create',
			operationName: 'createTicketState',
			fields: [
				crudField({
					name: 'name',
					location: 'body',
					defaultValue: '',
					validator: nonEmptyStringGuard,
				}),
				crudField({
					name: 'image',
					location: 'body',
					defaultValue: '',
					validator: stringGuard,
				}),
				crudField({
					name: 'waitState',
					location: 'body',
					defaultValue: false,
					validator: booleanGuard,
				}),
				crudField({
					name: 'rank',
					location: 'body',
					defaultValue: 0,
					validator: numberGuard,
				}),
				crudField({
					name: 'active',
					location: 'body',
					defaultValue: true,
					validator: booleanGuard,
				}),
			],
			httpMethod: 'POST',
			subPath: 'admin/ticketStates',
		}),
		crudOperation({
			type: 'update',
			operationName: 'updateTicketState',
			fields: [
				crudField({
					name: 'id',
					location: 'path',
					defaultValue: undefined,
					validator: numberGuard,
				}),
				crudField({
					name: 'name',
					location: 'body',
					defaultValue: '',
					validator: stringGuard,
				}),
				crudField({
					name: 'image',
					location: 'body',
					defaultValue: '',
					validator: stringGuard,
				}),
				crudField({
					name: 'waitState',
					location: 'body',
					defaultValue: false,
					validator: booleanGuard,
				}),
				crudField({
					name: 'rank',
					location: 'body',
					defaultValue: 0,
					validator: numberGuard,
				}),
				crudField({
					name: 'active',
					location: 'body',
					defaultValue: true,
					validator: booleanGuard,
				}),
			],
			httpMethod: 'PUT',
			subPath: 'admin/ticketStates/{id}',
		}),
		crudOperation({
			type: 'delete',
			operationName: 'deleteTicketState',
			fields: [
				crudField({
					name: 'id',
					location: 'path',
					defaultValue: undefined,
					validator: numberGuard,
				}),
			],
			httpMethod: 'DELETE',
			subPath: 'admin/ticketStates/{id}',
		}),
	],
});
