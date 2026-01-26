import { INodeProperties } from 'n8n-workflow';
import {
	createCrudHandler,
	arrayGuard,
	booleanGuard,
	createSubObjectGuard,
	csvGuard,
	jsonGuard,
	nullOrGuard,
	numberGuard,
	stringGuard,
	positiveNumberGuard,
} from '../lib';

export const callsUserOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['callsuser'] },
		},
		options: [
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
				name: 'Identifies a Phone Call',
				value: 'identifyCall',
				description: 'Tries to identify a phone call and resolve company and employeeId',
				action: 'Identify call',
			},
		],
		default: 'getCalls',
	},
];

export const callsUserFields: INodeProperties[] = [
	{
		displayName: 'Use Raw Filter JSON (Optional)',
		name: 'filterJson',
		type: 'string',
		default: '',
		description:
			'If provided (valid JSON), this object will be sent as the request body for the list call (overrides Filter Settings)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['getCalls'] },
		},
	},

	{
		displayName: 'Filter Settings',
		name: 'getCallsFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: { resource: ['callsuser'], operation: ['getCalls'] } },
		default: {},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyIdFilter',
				type: 'number',
				default: null,
			},
			{
				displayName: 'Directions',
				name: 'directions',
				type: 'multiOptions',
				options: [
					{ name: 'INTERNAL', value: 'INTERNAL' },
					{ name: 'INCOMING', value: 'INCOMING' },
					{ name: 'OUTGOING', value: 'OUTGOING' },
				],
				default: [],
			},
			{
				displayName: 'Employee ID',
				name: 'employeeIdFilter',
				type: 'number',
				default: null,
			},
			{
				displayName: 'Number Filters (Comma Separated)',
				name: 'numberFilters',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Number Infos',
				name: 'numberInfos',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Show Tries As Well',
				name: 'showTrysAsWell',
				type: 'boolean',
				default: false,
			},
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
		],
	},

	{
		displayName: 'Phone Call ID',
		name: 'phoneCallId',
		type: 'number',
		default: -1,
		description: 'ID of the phone call to fetch',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['getCallById'] },
		},
	},
	{
		displayName: 'From Phone Number',
		name: 'fromPhoneNumber',
		type: 'string',
		default: '',
		required: true,
		description: 'Phone number of the caller (= "from" number)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['identifyCall'] },
		},
	},
	{
		displayName: 'To Phone Number',
		name: 'toPhoneNumber',
		type: 'string',
		default: '',
		required: true,
		description: 'Phone number of the called (= "to" number)',
		displayOptions: {
			show: { resource: ['callsuser'], operation: ['identifyCall'] },
		},
	},
];

export const handleCallsUser = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getCalls: {
			fields: {
				filterJson: {
					location: 'body',
					spread: true,
					guard: nullOrGuard(jsonGuard),
				},
				getCallsFilters: {
					location: 'body',
					defaultValue: {},
					spread: true,
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
			},
			httpMethod: 'PUT',
			subPath: 'phoneCalls',
		},

		getCallById: {
			fields: {
				phoneCallId: {
					location: 'path',
					defaultValue: -1,
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'phoneCalls/{phoneCallId}',
		},

		identifyCall: {
			fields: {
				fromPhoneNumber: {
					location: 'body',
					defaultValue: '',
					guard: stringGuard,
				},
				toPhoneNumber: {
					location: 'body',
					defaultValue: '',
					guard: stringGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'phoneCalls/identify',
		},
	},
});
