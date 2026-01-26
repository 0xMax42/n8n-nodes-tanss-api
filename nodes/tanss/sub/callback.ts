import { INodeProperties } from 'n8n-workflow';
import {
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const callbackOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['callback'] } },
		options: [
			{
				name: 'Create Callback',
				value: 'createCallback',
				description: 'Create a new callback',
				action: 'Create callback',
			},
			{
				name: 'Get Callbacks From Filters',
				value: 'getCallbacks',
				description: 'Get callbacks information based on filters',
				action: 'Get callbacks',
			},
			{
				name: 'Get a Callback',
				value: 'getCallback',
				description: 'Get a specific callback information',
				action: 'Get a callback',
			},
			{
				name: 'Update a Callback',
				value: 'updateCallback',
				description: 'Update an existing callback',
				action: 'Update a callback',
			},
		],
		default: 'getCallbacks',
	},
];

export const callbackFields: INodeProperties[] = [
	{
		displayName: 'Callback ID',
		name: 'callbackId',
		required: true,
		displayOptions: {
			show: { resource: ['callback'], operation: ['getCallback', 'updateCallback'] },
		},
		type: 'number',
		default: null,
	},
	{
		displayName: 'Create/Update Callback Fields',
		name: 'createUpdateCallbackFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: { resource: ['callback'], operation: ['createCallback', 'updateCallback'] },
		},
		default: {},
		options: [
			{
				displayName: 'Callback After Time',
				name: 'callbackAfterTime',
				type: 'number',
				default: null,
				description:
					'If the callback has to be "later" than a specific time, give here the minimum date for the callback (timestamp)',
			},
			{
				displayName: 'Callback Until Time',
				name: 'callbackUntilTime',
				type: 'number',
				default: null,
				description:
					'If the callback has to be processed before a given date, specify this "latest" date here (timestamp)',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				default: null,
				description: 'Here, the ID of the company is given which has to be called back',
			},
			{
				displayName: 'Company Name',
				name: 'companyName',
				type: 'string',
				default: '',
				description:
					'Same as "companyId", but here a string can be given (i.e. if the company wasn\'t created yet in TANSS).',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'number',
				default: null,
				description: 'The callback was created on this date (timestamp)',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'number',
				default: null,
				description: 'Here, the ID of the employee is given (who has to be called back)',
			},
			{
				displayName: 'Employee Name',
				name: 'employeeName',
				type: 'string',
				default: '',
				description:
					'Same as "employeeId", but here a string can be given (i.e. if the employee wasn\'t created yet in TANSS).',
			},
			{
				displayName: 'From Employee ID',
				name: 'fromEmployeeId',
				type: 'number',
				default: null,
				description: 'Defines the employee who entered the callback',
			},
			{
				displayName: 'Info',
				name: 'info',
				type: 'string',
				default: '',
				description: '(Optional) Further information regarding the callback',
			},
			{
				displayName: 'Link ID',
				name: 'linkId',
				type: 'number',
				default: null,
				description:
					'If the callback is assigned to a ticket (or other assignment), the ID is given here',
			},
			{
				displayName: 'Link Type ID',
				name: 'linkTypeId',
				type: 'number',
				default: null,
				description:
					'If the callback is assigned to a ticket (or other assignment), linkType is given here',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'You must define the phone number here',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 9,
				},
				default: 1,
				description: 'Priority of the callback from 1 (lowest) to 9 (highest)',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				options: [
					{ name: 'BUSY', value: 'BUSY' },
					{ name: 'COMPLETED', value: 'COMPLETED' },
					{ name: 'EXPECTED_CALLBACK', value: 'EXPECTED_CALLBACK' },
					{ name: 'EXPECTED_CALLBACK_COMPLETED', value: 'EXPECTED_CALLBACK_COMPLETED' },
					{ name: 'NEW', value: 'NEW' },
					{ name: 'NEW_CALLBACK_REENTERED', value: 'NEW_CALLBACK_REENTERED' },
					{ name: 'NOBODY_ANSWERED', value: 'NOBODY_ANSWERED' },
					{ name: 'NOT_PRESENT', value: 'NOT_PRESENT' },
					{ name: 'UNSEEN', value: 'UNSEEN' },
				],
				default: 'UNSEEN',
				description: 'Describes a current "state" of a callback',
			},
			{
				displayName: 'To Department ID',
				name: 'toDepartmentId',
				type: 'number',
				default: null,
				description:
					'Callbacks can be assigned to a special department. Every employee of this department sees the callback.',
			},
			{
				displayName: 'To Employee ID',
				name: 'toEmployeeId',
				type: 'number',
				default: null,
				description: 'The callback is assigned to this employee (This person has to do the call)',
			},
		],
	},
	{
		displayName: 'Get Callbacks From Filters Fields',
		name: 'getCallbacksFromFiltersFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: { resource: ['callback'], operation: ['getCallbacks'] },
		},
		default: {},
		options: [
			{
				displayName: 'Callback After Time',
				name: 'callbackAfterTime',
				type: 'number',
				default: null,
				description:
					'If the callback has to be "later" than a specific time, give here the minimum date for the callback (timestamp)',
			},
			{
				displayName: 'Callback Until Time',
				name: 'callbackUntilTime',
				type: 'number',
				default: null,
				description:
					'If the callback has to be processed before a given date, specify this "latest" date here (timestamp)',
			},
			{
				displayName: 'Company IDs',
				name: 'companyIds',
				type: 'string',
				default: '',
				description: 'Filters only callbacks for these (customer) companies (IDs given here)',
			},
			{
				displayName: 'Employee IDs',
				name: 'employeeIds',
				type: 'string',
				default: '',
				description: 'Filters only callbacks for these (customer) employees (IDs given here)',
			},
			{
				displayName: 'From Employee ID',
				name: 'fromEmployeeId',
				type: 'number',
				default: null,
				description: 'Filters only callbacks which were created by this employee (technician)',
			},
			{
				displayName: 'Load Linked Entites',
				name: 'loadLinkedEntites',
				type: 'boolean',
				default: false,
				description: "Whether to load linked entities (given in the response's 'meta' section)",
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'multiOptions',
				options: [
					{ name: 'BUSY', value: 'BUSY' },
					{ name: 'COMPLETED', value: 'COMPLETED' },
					{ name: 'EXPECTED_CALLBACK', value: 'EXPECTED_CALLBACK' },
					{ name: 'EXPECTED_CALLBACK_COMPLETED', value: 'EXPECTED_CALLBACK_COMPLETED' },
					{ name: 'NEW', value: 'NEW' },
					{ name: 'NEW_CALLBACK_REENTERED', value: 'NEW_CALLBACK_REENTERED' },
					{ name: 'NOBODY_ANSWERED', value: 'NOBODY_ANSWERED' },
					{ name: 'NOT_PRESENT', value: 'NOT_PRESENT' },
					{ name: 'UNSEEN', value: 'UNSEEN' },
				],
				default: ['UNSEEN'],
				description: 'Describes a current "state" of a callback',
			},
			{
				displayName: 'To All Employees With Access To',
				name: 'toAllEmployeesWithAccessTo',
				type: 'boolean',
				default: false,
				description:
					"Whether to also retrieve all callbacks which the user has access to, if 'To Employee ID' is given",
			},
			{
				displayName: 'To Department IDs',
				name: 'toDepartmentIds',
				type: 'string',
				default: '',
				description: 'Filters only callbacks for these departments',
			},
			{
				displayName: 'To Employee ID',
				name: 'toEmployeeId',
				type: 'number',
				default: null,
				description: 'Filters only callbacks to this employee (techncian)',
			},
			{
				displayName: 'With Log',
				name: 'withLog',
				type: 'boolean',
				default: false,
				description: 'Whether to also load all state logs of the retrieved callbacks',
			},
		],
	},
];

export const handleCallback = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getCallback: {
			fields: {
				callbackId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: '/callbacks/{callbackId}',
		},

		getCallbacks: {
			fields: {
				getCallbacksFromFiltersFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						callbackAfterTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						callbackUntilTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						companyIds: {
							guard: nullOrGuard(stringGuard),
						},
						employeeIds: {
							guard: nullOrGuard(stringGuard),
						},
						fromEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						loadLinkedEntites: {
							guard: nullOrGuard(booleanGuard),
						},
						state: {
							guard: nullOrGuard(arrayGuard(stringGuard)),
						},
						toAllEmployeesWithAccessTo: {
							guard: nullOrGuard(booleanGuard),
						},
						toDepartmentIds: {
							guard: nullOrGuard(stringGuard),
						},
						toEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						withLog: {
							guard: nullOrGuard(booleanGuard),
						},
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: '/callbacks',
		},

		createCallback: {
			fields: {
				createUpdateCallbackFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						callbackAfterTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						callbackUntilTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						companyId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						companyName: {
							guard: nullOrGuard(stringGuard),
						},
						date: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						employeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						employeeName: {
							guard: nullOrGuard(stringGuard),
						},
						fromEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						info: {
							guard: nullOrGuard(stringGuard),
						},
						linkId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						linkTypeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						phoneNumber: {
							guard: nullOrGuard(stringGuard),
						},
						priority: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						state: {
							guard: nullOrGuard(stringGuard),
						},
						toDepartmentId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						toEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
					}),
				},
			},
			httpMethod: 'POST',
			subPath: '/callbacks',
		},

		updateCallback: {
			fields: {
				callbackId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				createUpdateCallbackFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						callbackAfterTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						callbackUntilTime: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						companyId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						companyName: {
							guard: nullOrGuard(stringGuard),
						},
						date: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						employeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						employeeName: {
							guard: nullOrGuard(stringGuard),
						},
						fromEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						info: {
							guard: nullOrGuard(stringGuard),
						},
						linkId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						linkTypeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						phoneNumber: {
							guard: nullOrGuard(stringGuard),
						},
						priority: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						state: {
							guard: nullOrGuard(stringGuard),
						},
						toDepartmentId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						toEmployeeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: '/callbacks/{callbackId}',
		},
	},
});
