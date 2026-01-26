import { INodeProperties } from 'n8n-workflow';
import {
	booleanGuard,
	nonEmptyStringGuard,
	numberGuard,
	positiveNumberGuard,
	stringGuard,
	createCrudHandler,
	nullOrGuard,
} from '../lib';

export const ticketStatesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
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
		type: 'number',
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
		type: 'string',
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
		type: 'string',
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
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: 'Whether this state is a wait state',
	},
	{
		displayName: 'Rank',
		name: 'rank',
		type: 'number',
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
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['ticketStates'],
				operation: ['createTicketState', 'updateTicketState'],
			},
		},
		description: "Whether the ticket state is active (won't show in ticket state lists if not)",
	},
];

export const handleTicketStates = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getTicketStates: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'admin/ticketStates',
		},

		createTicketState: {
			fields: {
				name: {
					location: 'body',
					defaultValue: '',
					guard: nonEmptyStringGuard,
				},
				image: {
					location: 'body',
					defaultValue: '',
					guard: stringGuard,
				},
				waitState: {
					location: 'body',
					defaultValue: false,
					guard: booleanGuard,
				},
				rank: {
					location: 'body',
					defaultValue: 0,
					guard: numberGuard,
				},
				active: {
					location: 'body',
					defaultValue: true,
					guard: booleanGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'admin/ticketStates',
		},

		updateTicketState: {
			fields: {
				id: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				name: {
					location: 'body',
					defaultValue: '',
					guard: nullOrGuard(stringGuard),
				},
				image: {
					location: 'body',
					defaultValue: '',
					guard: nullOrGuard(stringGuard),
				},
				waitState: {
					location: 'body',
					defaultValue: false,
					guard: nullOrGuard(booleanGuard),
				},
				rank: {
					location: 'body',
					defaultValue: 0,
					guard: nullOrGuard(numberGuard),
				},
				active: {
					location: 'body',
					defaultValue: true,
					guard: nullOrGuard(booleanGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'admin/ticketStates/{id}',
		},

		deleteTicketState: {
			fields: {
				id: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'admin/ticketStates/{id}',
		},
	},
});
