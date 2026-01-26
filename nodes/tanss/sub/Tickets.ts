import { INodeProperties } from 'n8n-workflow';
import {
	booleanGuard,
	createCrudHandler,
	nonEmptyRecordGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	positiveNumberGuard,
} from '../lib';

export const ticketOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticket'],
			},
		},
		options: [
			{
				name: 'Create Comment',
				value: 'createComment',
				description: 'Creates a comment for a specific ticket',
				action: 'Creates a comment for a specific ticket',
			},
			{
				name: 'Create Ticket',
				value: 'createTicket',
				description: 'Creates a new Ticket in TANSS',
				action: 'Creates a new ticket',
			},
			{
				name: 'Delete Ticket',
				value: 'deleteTicket',
				description: 'Deletes a ticket',
				action: 'Deletes a ticket',
			},
			{
				name: 'Get Ticket by ID',
				value: 'getTicketById',
				description: 'Fetches a ticket by ID',
				action: 'Fetches a ticket by ID',
			},
			{
				name: 'Get Ticket History',
				value: 'getTicketHistory',
				description: 'Fetches the history of a ticket',
				action: 'Fetches the history of a ticket',
			},
			{
				name: 'Merge Tickets',
				value: 'mergeTickets',
				description: 'Merges one ticket into another',
				action: 'Merges one ticket into another',
			},
			{
				name: 'Update Ticket',
				value: 'updateTicket',
				description: 'Updates a ticket with the provided details',
				action: 'Updates a ticket with the provided details',
			},
		],
		default: 'getTicketById',
	},
];

export const ticketFields: INodeProperties[] = [
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: [
					'getTicketById',
					'createComment',
					'getTicketHistory',
					'updateTicket',
					'deleteTicket',
					'mergeTickets',
				],
			},
		},
		default: 0,
		description: 'ID of the ticket',
	},
	{
		displayName: 'Target Ticket ID',
		name: 'targetTicketId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['deleteTicket', 'mergeTickets'],
			},
		},
		default: 0,
		description: 'ID of the target ticket for migrating or merging entities',
	},
	{
		displayName: 'Comment Title',
		name: 'commentTitle',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createComment'],
			},
		},
		default: '',
		description: 'Title of the comment',
	},
	{
		displayName: 'Comment Content',
		name: 'commentContent',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createComment'],
			},
		},
		default: '',
		description: 'Content of the comment',
	},
	{
		displayName: 'Internal',
		name: 'internal',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createComment'],
			},
		},
		default: false,
		description: 'Whether the comment is internal or public',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['updateTicket'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Assigned to Department ID',
				name: 'assignedToDepartmentId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Assigned to Employee ID',
				name: 'assignedToEmployeeId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Attention',
				name: 'attention',
				type: 'options',
				options: [
					{ name: 'No', value: 'NO' },
					{ name: 'Yes', value: 'YES' },
					{ name: 'Resubmission', value: 'RESUBMISSION' },
					{ name: 'Mail', value: 'MAIL' },
				],
				default: 'NO',
			},
			{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'Content', name: 'content', type: 'string', default: '' },
			{ displayName: 'Deadline Date', name: 'deadlineDate', type: 'number', default: 0 },
			{ displayName: 'Due Date', name: 'dueDate', type: 'number', default: 0 },
			{
				displayName: 'Estimated Minutes',
				name: 'estimatedMinutes',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'External Ticket ID',
				name: 'extTicketId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Installation Fee',
				name: 'installationFee',
				type: 'options',
				options: [
					{ name: 'No', value: 'NO' },
					{ name: 'Yes', value: 'YES' },
					{ name: 'No Project Installation Fee', value: 'NO_PROJECT_INSTALLATION_FEE' },
				],
				default: 'NO',
			},
			{ displayName: 'Order Number', name: 'orderNumber', type: 'string', default: '' },
			{ displayName: 'Phase ID', name: 'phaseId', type: 'number', default: 0 },
			{
				displayName: 'Relationship Link ID',
				name: 'relationshipLinkId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Relationship Link Type ID',
				name: 'relationshipLinkTypeId',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Remitter ID', name: 'remitterId', type: 'number', default: 0 },
			{
				displayName: 'Resubmission Date',
				name: 'resubmissionDate',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Status ID', name: 'statusId', type: 'number', default: 0 },
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Type ID', name: 'typeId', type: 'number', default: 0 },
		],
	},
	{
		displayName: 'Create Ticket Fields',
		name: 'createTicketFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['ticket'],
				operation: ['createTicket'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Assigned to Department ID',
				name: 'assignedToDepartmentId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Assigned to Employee ID',
				name: 'assignedToEmployeeId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Attention',
				name: 'attention',
				type: 'options',
				options: [
					{ name: 'No', value: 'NO' },
					{ name: 'Yes', value: 'YES' },
					{ name: 'Resubmission', value: 'RESUBMISSION' },
					{ name: 'Mail', value: 'MAIL' },
				],
				default: 'NO',
			},
			{
				displayName: 'Clearance Mode',
				name: 'clearanceMode',
				type: 'options',
				options: [
					{ name: 'Default', value: 'DEFAULT' },
					{ name: "Don't Clear Supports", value: 'DONT_CLEAR_SUPPORTS' },
					{ name: 'May Clear Supports', value: 'MAY_CLEAR_SUPPORTS' },
				],
				default: 'DEFAULT',
			},
			{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'Content', name: 'content', type: 'string', default: '' },
			{
				displayName: 'Deadline Date (Timestamp)',
				name: 'deadlineDate',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Due Date (Timestamp)', name: 'dueDate', type: 'number', default: 0 },
			{
				displayName: 'Estimated Minutes',
				name: 'estimatedMinutes',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'External Ticket ID',
				name: 'extTicketId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Installation Fee',
				name: 'installationFee',
				type: 'options',
				options: [
					{ name: 'No', value: 'NO' },
					{ name: 'Yes', value: 'YES' },
					{ name: 'No Project Installation Fee', value: 'NO_PROJECT_INSTALLATION_FEE' },
				],
				default: 'NO',
			},
			{
				displayName: 'Installation Fee Amount',
				name: 'installationFeeAmount',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Installation Fee Drive Mode',
				name: 'installationFeeDriveMode',
				type: 'options',
				options: [
					{ name: 'None (Default Behavior)', value: 'NONE' },
					{ name: 'Drive Included', value: 'DRIVE_INCLUDED' },
					{ name: 'Drive Excluded', value: 'DRIVE_EXCLUDED' },
				],
				default: 'NONE',
			},
			{ displayName: 'Link ID', name: 'linkId', type: 'number', default: 0 },
			{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number', default: 0 },
			{
				displayName: 'Local Ticket Admin Employee ID',
				name: 'localTicketAdminEmployeeId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Local Ticket Admin Flag',
				name: 'localTicketAdminFlag',
				type: 'options',
				options: [
					{ name: 'None', value: 'NONE' },
					{ name: 'Local Admin', value: 'LOCAL_ADMIN' },
					{ name: 'Technician', value: 'TECHNICIAN' },
				],
				default: 'NONE',
			},
			{ displayName: 'Order By ID', name: 'orderById', type: 'number', default: 0 },
			{ displayName: 'Order Number', name: 'orderNumber', type: 'string', default: '' },
			{ displayName: 'Phase ID', name: 'phaseId', type: 'number', default: 0 },
			{ displayName: 'Project', name: 'project', type: 'boolean', default: false },
			{ displayName: 'Project ID', name: 'projectId', type: 'number', default: 0 },
			{
				displayName: 'Relationship Link ID',
				name: 'relationshipLinkId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Relationship Link Type ID',
				name: 'relationshipLinkTypeId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Reminder (Timestamp)',
				name: 'reminder',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Remitter ID', name: 'remitterId', type: 'number', default: 0 },
			{ displayName: 'Repair', name: 'repair', type: 'boolean', default: false },
			{
				displayName: 'Resubmission Date (Timestamp)',
				name: 'resubmissionDate',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Resubmission Text',
				name: 'resubmissionText',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Separate Billing',
				name: 'separateBilling',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Service Cap Amount',
				name: 'serviceCapAmount',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Status ID', name: 'statusId', type: 'number', default: 0 },
			{
				displayName: 'Sub Tickets',
				name: 'subTickets',
				type: 'json',
				default: '',
				description: 'An array of objects to immediately assign sub-tickets if creating a project',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'json',
				default: '',
				description:
					'An array of objects with tag assignments which will be assigned to the ticket',
			},
			{ displayName: 'Title', name: 'title', type: 'string', default: '' },
			{ displayName: 'Type ID', name: 'typeId', type: 'number', default: 0 },
		],
	},
];

export const handleTicket = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		createTicket: {
			httpMethod: 'POST',
			subPath: 'tickets',
			fields: {
				// TODO: Create a subObjectGuard for this
				createTicketFields: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: nonEmptyRecordGuard,
				},
			},
		},

		getTicketById: {
			httpMethod: 'GET',
			subPath: 'tickets/{ticketId}',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
		},

		getTicketHistory: {
			httpMethod: 'GET',
			subPath: 'tickets/history/{ticketId}',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
		},

		createComment: {
			httpMethod: 'POST',
			subPath: 'tickets/{ticketId}/comments',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				commentTitle: {
					location: 'body',
					locationName: 'title',
					guard: nonEmptyStringGuard,
				},
				commentContent: {
					location: 'body',
					locationName: 'content',
					guard: nonEmptyStringGuard,
				},
				internal: {
					location: 'body',
					guard: booleanGuard,
				},
			},
		},

		updateTicket: {
			httpMethod: 'PUT',
			subPath: 'tickets/{ticketId}',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				// TODO: Create a subObjectGuard for this
				updateFields: {
					location: 'body',
					spread: true,
					guard: nonEmptyRecordGuard,
				},
			},
		},

		deleteTicket: {
			httpMethod: 'DELETE',
			subPath: 'tickets/{ticketId}',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				targetTicketId: {
					location: 'query',
					guard: nullOrGuard(positiveNumberGuard),
				},
			},
		},

		mergeTickets: {
			httpMethod: 'PUT',
			subPath: 'tickets/{ticketId}/merge/{targetTicketId}',
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				targetTicketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
		},
	},
});
