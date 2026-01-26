import { INodeProperties } from 'n8n-workflow';
import {
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	CrudFieldMap,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const ticketListOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketList'],
			},
		},
		options: [
			{
				name: 'Get All Project Tickets',
				value: 'getProjectTickets',
				description: 'Get a list of all projects',
				action: 'Get a list of all projects',
			},
			{
				name: 'Get Company Tickets',
				value: 'getCompanyTickets',
				description: 'Get tickets for a specific company',
				action: 'Get tickets for a specific company',
			},
			{
				name: 'Get Custom Ticket List',
				value: 'getCustomTicketList',
				description: 'Get a custom ticket list with query parameters',
				action: 'Get a custom ticket list',
			},
			{
				name: 'Get General Tickets',
				value: 'getGeneralTickets',
				description: 'Get general tickets assigned to no employee',
				action: 'Get general tickets assigned to no employee',
			},
			{
				name: 'Get Local Admin Tickets',
				value: 'getLocalAdminTickets',
				description: 'Gets a list of all tickets which are assigned to local ticket admins',
				action: 'Get a list of local admin tickets',
			},
			{
				name: 'Get Not Identified Tickets',
				value: 'getNotIdentifiedTickets',
				description: 'Get tickets not assigned to any company',
				action: 'Get tickets not assigned to any company',
			},
			{
				name: 'Get Own Tickets',
				value: 'getOwnTickets',
				description: 'Get tickets assigned to the current employee',
				action: 'Get tickets assigned to the current employee',
			},
			{
				name: 'Get Repair Tickets',
				value: 'getRepairTickets',
				description: 'Gets a list of repair tickets',
				action: 'Get a list of repair tickets',
			},
			{
				name: 'Get Technician Tickets',
				value: 'getTechnicianTickets',
				description: 'Get tickets assigned to other technicians',
				action: 'Get tickets assigned to other technicians',
			},
			{
				name: 'Get Tickets With Role',
				value: 'getTicketsWithRole',
				description: 'Gets a list of all tickets which a technician has a role in',
				action: 'Get a list of tickets with technician role',
			},
		],
		default: 'getOwnTickets',
	},
];

export const ticketListFields: INodeProperties[] = [
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketList'],
				operation: ['getCompanyTickets'],
			},
		},
		default: 0,
		description: 'ID of the company for which to fetch tickets',
	},
	{
		displayName: 'Custom Ticket Query',
		name: 'customTicketQuery',
		type: 'collection' as const,
		displayOptions: {
			show: {
				resource: ['ticketList'],
				operation: ['getCustomTicketList'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{
				displayName: 'Companies',
				name: 'companies',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Departments',
				name: 'departments',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'IDs',
				name: 'ids',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Include Done Tickets',
				name: 'includeDoneTickets',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Is Repair', name: 'isRepair', type: 'boolean' as const, default: false },
			{ displayName: 'Items Per Page', name: 'itemsPerPage', type: 'number' as const, default: 20 },
			{
				displayName: 'Modified Within Timeframe',
				name: 'modifiedWithinTimeframe',
				type: 'fixedCollection' as const,
				typeOptions: { multipleValues: false },
				default: {},
				options: [
					{
						name: 'timeframe',
						displayName: 'Timeframe',
						values: [
							{
								displayName: 'From',
								name: 'from',
								type: 'number' as const,
								default: 0,
								description: 'Unix timestamp of the "from" date',
							},
							{
								displayName: 'To',
								name: 'to',
								type: 'number' as const,
								default: 0,
								description: 'Unix timestamp of the "to" date',
							},
						],
					},
				],
			},
			{
				displayName: 'Not Assigned To Employees',
				name: 'notAssignedToEmployees',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{ displayName: 'Page', name: 'page', type: 'number' as const, default: 1 },
			{ displayName: 'Phase ID', name: 'phaseId', type: 'number' as const, default: 0 },
			{ displayName: 'Project ID', name: 'projectId', type: 'number' as const, default: 0 },
			{ displayName: 'Remitter ID', name: 'remitterId', type: 'number' as const, default: 0 },
			{
				displayName: 'Staff',
				name: 'staff',
				type: 'string' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'States',
				name: 'states',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'multiOptions' as const,
				typeOptions: { multipleValues: true },
				default: [],
			},
		],
	},
];

const companyIdField = {
	companyId: {
		location: 'path',
		guard: positiveNumberGuard,
	},
} satisfies CrudFieldMap;

const customTicketQueryField = {
	customTicketQuery: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			companies: {
				guard: nullOrGuard(arrayGuard(positiveNumberGuard)),
			},
			departments: {
				guard: nullOrGuard(arrayGuard(positiveNumberGuard)),
			},
			ids: {
				guard: nullOrGuard(arrayGuard(positiveNumberGuard)),
			},
			includeDoneTickets: {
				guard: nullOrGuard(booleanGuard),
			},
			isRepair: {
				guard: nullOrGuard(booleanGuard),
			},
			itemsPerPage: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			modifiedWithinTimeframe: {
				guard: nullOrGuard(
					createSubObjectGuard({
						from: { guard: nullOrGuard(positiveNumberGuard) },
						to: { guard: nullOrGuard(positiveNumberGuard) },
					}),
				),
			},
			notAssignedToEmployees: {
				guard: nullOrGuard(arrayGuard(positiveNumberGuard)),
			},
			page: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			phaseId: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			projectId: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			remitterId: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			staff: {
				guard: nullOrGuard(arrayGuard(positiveNumberGuard)),
			},
			states: {
				guard: nullOrGuard(arrayGuard(stringGuard)),
			},
			types: {
				guard: nullOrGuard(arrayGuard(stringGuard)),
			},
		}),
	},
} satisfies CrudFieldMap;

export const handleTicketList = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getOwnTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/own',
			fields: {},
		},

		getGeneralTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/general',
			fields: {},
		},

		getCompanyTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/company/{companyId}',
			fields: {
				...companyIdField,
			},
		},

		getNotIdentifiedTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/notIdentified',
			fields: {},
		},

		getProjectTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/projects',
			fields: {},
		},

		getTechnicianTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/technician',
			fields: {},
		},

		getRepairTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/repair',
			fields: {},
		},

		getLocalAdminTickets: {
			httpMethod: 'GET',
			subPath: 'tickets/localAdminOverview',
			fields: {},
		},

		getTicketsWithRole: {
			httpMethod: 'GET',
			subPath: 'tickets/withRole',
			fields: {},
		},

		getCustomTicketList: {
			httpMethod: 'PUT',
			subPath: 'tickets',
			fields: {
				...customTicketQueryField,
			},
		},
	},
});
