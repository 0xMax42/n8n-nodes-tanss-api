import { INodeProperties } from 'n8n-workflow';
import {
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	CrudFieldMap,
	csvGuard,
	jsonGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	numberGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const callsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['calls'],
			},
		},
		options: [
			{
				name: 'Create / Import Call',
				value: 'createCall',
				description: 'Creates/imports a phone call into the database',
				action: 'Create call',
			},
			{
				name: 'Get a List of Phone Calls',
				value: 'getCalls',
				description: 'Retrieves a list of phone calls using filter settings',
				action: 'Get calls',
			},
			{
				name: 'Get Phone Call By ID',
				value: 'getCallById',
				description: 'Gets a specific phone call by its ID',
				action: 'Get call by id',
			},
			{
				name: 'Update Phone Call',
				value: 'updateCall',
				description: 'Updates an existing phone call by ID',
				action: 'Update call',
			},
			{
				name: 'Identify Phone Call',
				value: 'identifyCall',
				description: 'Identifies a phone call and resolves company / employee IDs',
				action: 'Identify call',
			},
			{
				name: 'Get All Employee Assignments',
				value: 'getEmployeeAssignments',
				description: 'Get all assignments between idStrings and TANSS employees',
				action: 'Get employee assignments',
			},
			{
				name: 'Create Employee Assignment',
				value: 'createEmployeeAssignment',
				description: 'Creates a new assignment between an idString and a TANSS employee',
				action: 'Create employee assignment',
			},
			{
				name: 'Delete Employee Assignment',
				value: 'deleteEmployeeAssignment',
				description: 'Deletes an assignment between an idString and a TANSS employee',
				action: 'Delete employee assignment',
			},
			{
				name: 'Creates a Call Notification',
				value: 'createNotification',
				description: 'Generates a notification (popup) for an incoming or outgoing call',
				action: 'Create call notification',
			},
		],
		default: 'createCall',
	},
];

export const callsFields: INodeProperties[] = [
	{
		displayName: 'Notification Fields',
		name: 'notificationFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createNotification'],
			},
		},
		default: {},
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'callId', name: 'callId', type: 'string' as const, default: '' },
			{
				displayName: 'telephoneSystemId',
				name: 'telephoneSystemId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Date (Timestamp)', name: 'date', type: 'number' as const, default: 0 },
			{
				displayName: 'From Phone Number',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'fromPhoneNrInfos (JSON)',
				name: 'fromPhoneNrInfos',
				type: 'string' as const,
				default: '',
				description: 'Optional JSON object',
			},
			{
				displayName: 'To Phone Number',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
			},
			{
				displayName: 'toPhoneNrInfos (JSON)',
				name: 'toPhoneNrInfos',
				type: 'string' as const,
				default: '',
				description: 'Optional JSON object',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: 'INTERNAL',
			},
			{
				displayName: 'connectionEstablished',
				name: 'connectionEstablished',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'durationTotal (Seconds)',
				name: 'durationTotal',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'durationCall (Seconds)',
				name: 'durationCall',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Group', name: 'group', type: 'string' as const, default: '' },
			{
				displayName: 'Phone Participants JSON',
				name: 'phoneParticipantsJson',
				type: 'string' as const,
				default: '',
				description: 'JSON array of phone participant objects. If provided, this will be used.',
			},
			{
				displayName: 'Phone Participants (Collection)',
				name: 'phoneParticipants',
				type: 'fixedCollection' as const,
				placeholder: 'Add participant',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Participant',
						name: 'participant',
						values: [
							{
								displayName: 'phoneCallId',
								name: 'phoneCallId',
								type: 'number' as const,
								default: 0,
							},
							{ displayName: 'idString', name: 'idString', type: 'string' as const, default: '' },
							{
								displayName: 'employeeId',
								name: 'employeeId',
								type: 'number' as const,
								default: 0,
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Filter Settings',
		name: 'getCallsFilters',
		type: 'collection' as const,
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['getCalls'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Timeframe',
				name: 'timeframe',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'range',
						displayName: 'Range',
						values: [
							{
								displayName: 'From (Timestamp)',
								name: 'from',
								type: 'number',
								default: null,
							},
							{
								displayName: 'To (Timestamp)',
								name: 'to',
								type: 'number',
								default: null,
							},
						],
					},
				],
			},
			{
				displayName: 'Show Tries As Well',
				name: 'showTrysAsWell',
				type: 'boolean' as const,
				default: false,
				description: 'If true, include calls without established connection',
			},
			{
				displayName: 'Number Filters (Comma Separated)',
				name: 'numberFilters',
				type: 'string' as const,
				default: '',
				description: 'One or more telephone number filters, comma-separated',
			},
			{
				displayName: 'Employee ID',
				name: 'employeeIdFilter',
				type: 'number' as const,
				default: 0,
				description: 'Only show phone calls of this employee',
			},
			{
				displayName: 'Company ID',
				name: 'companyIdFilter',
				type: 'number' as const,
				default: 0,
				description: 'Only show phone calls of this company',
			},
			{
				displayName: 'Number Infos',
				name: 'numberInfos',
				type: 'boolean' as const,
				default: false,
				description: 'If true, fromPhoneNrInfos and toPhoneNrInfos will be determined',
			},
			{
				displayName: 'Directions',
				name: 'directions',
				type: 'multiOptions' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: [],
				description: 'Filter by call directions',
			},
		],
	},

	{
		displayName: 'Phone Call ID',
		name: 'phoneCallId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the phone call to fetch/update',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['getCallById', 'updateCall'],
			},
		},
	},
	{
		displayName: 'Identify Fields',
		name: 'identifyFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['identifyCall'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'From Phone Number',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number of the caller',
			},
			{
				displayName: 'To Phone Number',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number of the called party',
			},
		],
	},

	{
		displayName: 'Employee Assignment Fields',
		name: 'employeeAssignmentFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createEmployeeAssignment', 'deleteEmployeeAssignment'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Employee ID',
				name: 'employeeId',
				type: 'number' as const,
				default: 0,
				description: 'ID of the TANSS employee',
			},
			{
				displayName: 'Username / idString',
				name: 'username',
				type: 'string' as const,
				default: '',
				description: 'Identifier string of the employee (idString)',
			},
		],
	},
	{
		displayName: 'Create Call Fields',
		name: 'createCallFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['calls'],
				operation: ['createCall', 'updateCall'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Date (Timestamp)',
				name: 'date',
				type: 'number' as const,
				default: 0,
				description: 'Unix timestamp representing the begin of the phone call',
			},
			{
				displayName: 'fromPhoneNumber',
				name: 'fromPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number (or identifier) of the caller',
			},
			{
				displayName: 'toPhoneNumber',
				name: 'toPhoneNumber',
				type: 'string' as const,
				default: '',
				description: 'Phone number (or identifier) of the called party',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options' as const,
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: 'INTERNAL',
				description: 'Defines the direction of the call',
			},
			{
				displayName: 'callId',
				name: 'callId',
				type: 'string' as const,
				default: '',
				description: 'External ID of the phone call',
			},
			{
				displayName: 'telephoneSystemId',
				name: 'telephoneSystemId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'fromCompanyId', name: 'fromCompanyId', type: 'number' as const, default: 0 },
			{
				displayName: 'fromCompanyPercent',
				name: 'fromCompanyPercent',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'fromEmployeeId',
				name: 'fromEmployeeId',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'toCompanyId', name: 'toCompanyId', type: 'number' as const, default: 0 },
			{
				displayName: 'toCompanyPercent',
				name: 'toCompanyPercent',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'toEmployeeId', name: 'toEmployeeId', type: 'number' as const, default: 0 },
			{
				displayName: 'connectionEstablished',
				name: 'connectionEstablished',
				type: 'boolean' as const,
				default: false,
			},
			{
				displayName: 'durationTotal (Seconds)',
				name: 'durationTotal',
				type: 'number' as const,
				default: 0,
			},
			{
				displayName: 'durationCall (Seconds)',
				name: 'durationCall',
				type: 'number' as const,
				default: 0,
			},
			{ displayName: 'Group', name: 'group', type: 'string' as const, default: '' },
			{
				displayName: 'numberIdentifyState',
				name: 'numberIdentifyState',
				type: 'string' as const,
				default: '',
			},

			{
				displayName: 'Phone Participants JSON',
				name: 'phoneParticipantsJson',
				type: 'string' as const,
				default: '',
				description: 'JSON array of phone participant objects. If provided, this will be used.',
			},
			{
				displayName: 'Phone Participants (Collection)',
				name: 'phoneParticipants',
				type: 'fixedCollection' as const,
				placeholder: 'Add participant',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Participant',
						name: 'participant',
						values: [
							{ displayName: 'idString', name: 'idString', type: 'string' as const, default: '' },
							{
								displayName: 'employeeId',
								name: 'employeeId',
								type: 'number' as const,
								default: 0,
							},
						],
					},
				],
			},
		],
	},
];

const phoneCallIdField = {
	phoneCallId: {
		location: 'path',
		guard: positiveNumberGuard,
	},
} satisfies CrudFieldMap;

const employeeAssignmentFields = {
	employeeAssignmentFields: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			employeeId: { guard: positiveNumberGuard },
			username: { guard: nonEmptyStringGuard },
		}),
	},
} satisfies CrudFieldMap;

const createCallFields = {
	createCallFields: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard({
			date: { guard: nullOrGuard(positiveNumberGuard) },
			fromPhoneNumber: { guard: nullOrGuard(stringGuard) },
			toPhoneNumber: { guard: nullOrGuard(stringGuard) },

			direction: { guard: nullOrGuard(stringGuard) },

			callId: { guard: nullOrGuard(stringGuard) },
			telephoneSystemId: { guard: nullOrGuard(positiveNumberGuard) },

			fromCompanyId: { guard: nullOrGuard(positiveNumberGuard) },
			fromCompanyPercent: { guard: nullOrGuard(positiveNumberGuard) },
			fromEmployeeId: { guard: nullOrGuard(positiveNumberGuard) },

			toCompanyId: { guard: nullOrGuard(positiveNumberGuard) },
			toCompanyPercent: { guard: nullOrGuard(positiveNumberGuard) },
			toEmployeeId: { guard: nullOrGuard(positiveNumberGuard) },

			connectionEstablished: { guard: nullOrGuard(booleanGuard) },

			durationTotal: { guard: nullOrGuard(positiveNumberGuard) },
			durationCall: { guard: nullOrGuard(positiveNumberGuard) },

			group: { guard: nullOrGuard(stringGuard) },
			numberIdentifyState: { guard: nullOrGuard(stringGuard) },

			// TODO: Check if this can be removed
			phoneParticipantsJson: {
				guard: nullOrGuard(jsonGuard),
			},
			phoneParticipants: {
				guard: createSubObjectGuard(
					{
						participant: {
							spread: true,
							guard: arrayGuard(
								createSubObjectGuard({
									idString: { guard: nonEmptyStringGuard },
									employeeId: { guard: positiveNumberGuard },
								}),
							),
						},
					},
					{ allowEmpty: true },
				),
			},
		}),
	},
} satisfies CrudFieldMap;

const getCallsFilters = {
	getCallsFilters: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard(
			{
				timeframe: {
					guard: createSubObjectGuard(
						{
							range: {
								spread: true,
								guard: createSubObjectGuard(
									{
										from: {
											guard: nullOrGuard(numberGuard),
										},
										to: {
											guard: nullOrGuard(numberGuard),
										},
									},
									{ allowEmpty: true },
								),
							},
						},
						{ allowEmpty: true },
					),
				},
				showTrysAsWell: {
					guard: nullOrGuard(booleanGuard),
				},
				numberFilters: {
					guard: nullOrGuard(csvGuard),
				},
				employeeIdFilter: {
					locationName: 'employeeId',

					guard: nullOrGuard(numberGuard),
				},
				companyIdFilter: {
					locationName: 'companyId',

					guard: nullOrGuard(numberGuard),
				},
				numberInfos: {
					guard: nullOrGuard(booleanGuard),
				},
				directions: {
					guard: nullOrGuard(arrayGuard(stringGuard)),
				},
			},
			{ allowEmpty: true },
		),
	},
} satisfies CrudFieldMap;

const notificationFields = {
	notificationFields: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			id: { guard: positiveNumberGuard },
			callId: { guard: nullOrGuard(stringGuard) },
			telephoneSystemId: { guard: nullOrGuard(positiveNumberGuard) },
			date: { guard: nullOrGuard(positiveNumberGuard) },
			fromPhoneNumber: { guard: nullOrGuard(stringGuard) },
			// TODO: Check if this can be removed
			fromPhoneNrInfos: { guard: nullOrGuard(jsonGuard) },
			toPhoneNumber: { guard: nullOrGuard(stringGuard) },
			// TODO: Check if this can be removed
			toPhoneNrInfos: { guard: nullOrGuard(jsonGuard) },
			direction: { guard: nullOrGuard(stringGuard) },
			connectionEstablished: { guard: nullOrGuard(booleanGuard) },
			durationTotal: { guard: nullOrGuard(positiveNumberGuard) },
			durationCall: { guard: nullOrGuard(positiveNumberGuard) },
			group: { guard: nullOrGuard(stringGuard) },
			// TODO: Check if this can be removed
			phoneParticipantsJson: { guard: nullOrGuard(jsonGuard) },
			phoneParticipants: {
				guard: createSubObjectGuard(
					{
						participant: {
							spread: true,
							guard: arrayGuard(
								createSubObjectGuard({
									idString: { guard: nonEmptyStringGuard },
									employeeId: { guard: positiveNumberGuard },
								}),
							),
						},
					},
					{ allowEmpty: true },
				),
			},
		}),
	},
} satisfies CrudFieldMap;

export const handleCalls = createCrudHandler({
	operationField: 'operation',
	credentialType: 'system',

	operations: {
		getCallById: {
			fields: phoneCallIdField,
			httpMethod: 'GET',
			subPath: 'calls/v1/{phoneCallId}',
			basePath: 'backend/api',
		},

		identifyCall: {
			fields: {
				identifyFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						fromPhoneNumber: { guard: nonEmptyStringGuard },
						toPhoneNumber: { guard: nonEmptyStringGuard },
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'calls/v1/identify',
			basePath: 'backend/api',
		},

		getEmployeeAssignments: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'calls/v1/employeeAssignment',
			basePath: 'backend/api',
		},

		createEmployeeAssignment: {
			fields: employeeAssignmentFields,
			httpMethod: 'POST',
			subPath: 'calls/v1/employeeAssignment',
			basePath: 'backend/api',
		},

		deleteEmployeeAssignment: {
			fields: employeeAssignmentFields,
			httpMethod: 'DELETE',
			subPath: 'calls/v1/employeeAssignment',
			basePath: 'backend/api',
		},

		createCall: {
			fields: createCallFields,
			httpMethod: 'POST',
			subPath: 'calls/v1',
			basePath: 'backend/api',
		},

		updateCall: {
			fields: {
				...phoneCallIdField,
				...createCallFields,
			},
			httpMethod: 'PUT',
			subPath: 'calls/v1/{phoneCallId}',
			basePath: 'backend/api',
		},

		getCalls: {
			fields: getCallsFilters,
			httpMethod: 'PUT',
			subPath: 'calls/v1',
			basePath: 'backend/api',
		},

		createNotification: {
			fields: notificationFields,
			httpMethod: 'POST',
			subPath: 'calls/v1/notification',
			basePath: 'backend/api',
		},
	},
});
