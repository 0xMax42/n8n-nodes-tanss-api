import { INodeProperties } from 'n8n-workflow';
import {
	createCrudHandler,
	jsonGuard,
	nullOrGuard,
	numberGuard,
	positiveNumberGuard,
} from '../lib';

export const checklistOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checklist'],
			},
		},
		options: [
			{
				name: 'Assign Checklist to Ticket',
				value: 'assignChecklistToTicket',
				description: 'Assign a checklist to a ticket',
				action: 'Assign a checklist to a ticket',
			},
			{
				name: 'Check Item',
				value: 'checkItem',
				description: 'Check or uncheck an item in a checklist',
				action: 'Check or uncheck an item in a checklist',
			},
			{
				name: 'Get Checklist for Ticket',
				value: 'getChecklistForTicket',
				description: 'Get a checklist for a ticket',
				action: 'Get a checklist for a ticket',
			},
			{
				name: 'Get Checklists for Ticket',
				value: 'getChecklistsForTicket',
				description: 'Get all checklists for a ticket',
				action: 'Get all checklists for a ticket',
			},
			{
				name: 'Remove Checklist From Ticket',
				value: 'removeChecklistFromTicket',
				description: 'Remove a checklist from a ticket',
				action: 'Remove a checklist from a ticket',
			},
		],
		default: 'assignChecklistToTicket',
	},
];

export const checklistFields: INodeProperties[] = [
	{
		displayName: 'Link Type ID',
		name: 'linkTypeId',
		type: 'number',
		required: true,
		default: 11,
		description: 'Link Type ID (11 = ticket)',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: [
					'assignChecklistToTicket',
					'removeChecklistFromTicket',
					'getChecklistsForTicket',
					'getChecklistForTicket',
					'checkItem',
				],
			},
		},
	},
	{
		displayName: 'Link ID',
		name: 'linkId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the ticket',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: [
					'assignChecklistToTicket',
					'removeChecklistFromTicket',
					'getChecklistsForTicket',
					'getChecklistForTicket',
					'checkItem',
				],
			},
		},
	},
	{
		displayName: 'Checklist ID',
		name: 'checklistId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the checklist',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: [
					'assignChecklistToTicket',
					'removeChecklistFromTicket',
					'getChecklistForTicket',
				],
			},
		},
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the checklist item that will be checked',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: ['checkItem'],
			},
		},
	},
	{
		displayName: 'Value',
		name: 'value',
		type: 'options',
		required: true,
		options: [
			{
				name: 'Check',
				value: 1,
				description: 'Check the item',
			},
			{
				name: 'Uncheck',
				value: 0,
				description: 'Uncheck the item',
			},
		],
		default: 1,
		description: '1 = check / 0 = uncheck',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: ['checkItem'],
			},
		},
	},
	{
		displayName: 'Main Checklist ID',
		name: 'mainChecklistId',
		type: 'number',
		default: 0,
		description:
			'If the item is part of an "included" checklist, you must specify the "main" checklist as well',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: ['checkItem'],
			},
		},
	},
	{
		displayName: 'Multi Select ID',
		name: 'multiSelectId',
		type: 'number',
		default: 0,
		description: 'If a multiselect option is checked, give the multiselect option ID here',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: ['checkItem'],
			},
		},
	},
	{
		displayName: 'Vars',
		name: 'vars',
		type: 'json',
		default: '',
		description: 'If vars are needed for checking this field, then give these here',
		displayOptions: {
			show: {
				resource: ['checklist'],
				operation: ['checkItem'],
			},
		},
	},
];

export const handleChecklist = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		assignChecklistToTicket: {
			fields: {
				linkTypeId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				linkId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				checklistId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'checklists/assignment/{linkTypeId}/{linkId}/{checklistId}',
		},

		removeChecklistFromTicket: {
			fields: {
				linkTypeId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				linkId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				checklistId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'checklists/assignment/{linkTypeId}/{linkId}/{checklistId}',
		},

		getChecklistsForTicket: {
			fields: {
				linkTypeId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				linkId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'checklists/assignment/{linkTypeId}/{linkId}',
		},

		getChecklistForTicket: {
			fields: {
				linkTypeId: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				linkId: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				checklistId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'checklists/{checklistId}/process',
		},

		checkItem: {
			fields: {
				checklistId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				linkTypeId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				linkId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				itemId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				value: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				mainChecklistId: {
					location: 'body',
					guard: nullOrGuard(numberGuard),
				},
				multiSelectId: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
				vars: {
					location: 'body',
					guard: nullOrGuard(jsonGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'checklists/check',
		},
	},
});
