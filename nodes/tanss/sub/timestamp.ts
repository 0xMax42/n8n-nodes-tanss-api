import { INodeProperties } from 'n8n-workflow';
import {
	ApiQuirks,
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	discardGuard,
	jsonAndGuard,
	jsonGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	numberGuard,
	positiveNumberGuard,
} from '../lib';

export const timestampOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timestamps'],
			},
		},
		options: [
			{
				name: 'Get Timestamps',
				value: 'getTimestamps',
				description: 'Gets a list of timestamps from a given period',
				action: 'Get timestamps',
			},
			{
				name: 'Get Timestamp Info',
				value: 'getTimestampInfo',
				description: 'Gets the timestamp infos for a given time period',
				action: 'Get timestamp info',
			},
			{
				name: 'Get Timestamp Statistics',
				value: 'getTimestampStatistics',
				description: 'Gets the timestamp infos for a given time period (with statistical values)',
				action: 'Get timestamp statistics',
			},
			{
				name: 'Create Timestamp',
				value: 'createTimestamp',
				description: 'Writes a timestamp into the database',
				action: 'Create timestamp',
			},
			{
				name: 'Update Timestamp',
				value: 'updateTimestamp',
				description: 'Edits a single timestamp',
				action: 'Update timestamp',
			},
			{
				name: 'Save Day Timestamps',
				value: 'saveDayTimestamps',
				description: 'Writes the timestamps of a whole day into the database at once',
				action: 'Save day timestamps',
			},
			{
				name: 'Create Day Closing(s)',
				value: 'createDayClosing',
				description: 'Creates one or more day closings',
				action: 'Create day closing(s)',
			},
			{
				name: 'Delete Day Closing(s)',
				value: 'deleteDayClosing',
				description: 'Deletes one or more day closings (undo)',
				action: 'Delete day closing(s)',
			},
			{
				name: 'Get Day Closing Till Date',
				value: 'getDayClosingTillDate',
				description: 'Gets all infos about last dayclosings for employees',
				action: 'Get day closing till date',
			},
			{
				name: 'Create Day Closings Till Date',
				value: 'createDayClosingsTillDate',
				description: 'Creates missing dayClosings for given employees till a date',
				action: 'Create day closings till date',
			},
			{
				name: 'Set Initial Balance',
				value: 'setInitialBalance',
				description: 'Sets the initial balance for an employee',
				action: 'Set initial balance',
			},
			{
				name: 'Get Pause Configs',
				value: 'getPauseConfigs',
				description: 'Gets a list of all pause configs',
				action: 'Get pause configs',
			},
			{
				name: 'Create Pause Config',
				value: 'createPauseConfig',
				description: 'Creates a pause config',
				action: 'Create pause config',
			},
			{
				name: 'Update Pause Config',
				value: 'updatePauseConfig',
				description: 'Updates a pause config',
				action: 'Update pause config',
			},
			{
				name: 'Delete Pause Config',
				value: 'deletePauseConfig',
				description: 'Deletes a pause config',
				action: 'Delete pause config',
			},
		],
		default: 'getTimestamps',
	},
];

export const timestampFields: INodeProperties[] = [
	// getTimestamps / info / statistics params
	{
		displayName: 'From (Timestamp)',
		name: 'from',
		type: 'number' as const,
		default: 0,
		description:
			'Timestamp of start of period. If omitted, beginning of current day is used by the API.',
		displayOptions: {
			show: {
				resource: ['timestamps'],
				operation: ['getTimestamps', 'getTimestampInfo', 'getTimestampStatistics'],
			},
		},
	},
	{
		displayName: 'Till (Timestamp)',
		name: 'till',
		type: 'number' as const,
		default: 0,
		description: 'Timestamp of end of period. If omitted, end of current day is used by the API.',
		displayOptions: {
			show: {
				resource: ['timestamps'],
				operation: ['getTimestamps', 'getTimestampInfo', 'getTimestampStatistics'],
			},
		},
	},
	{
		displayName: 'Employee IDs (Comma Separated)',
		name: 'employeeIds',
		type: 'string' as const,
		default: '',
		description:
			'Comma-separated list of employee IDs for which statistics shall be generated (only for statistics operation)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['getTimestampStatistics'] } },
	},

	// createTimestamp fields
	{
		displayName: 'Auto Pause',
		name: 'autoPause',
		type: 'boolean' as const,
		default: false,
		description: 'If true, a pause will automatically be inserted if minimum pause is not met',
		displayOptions: { show: { resource: ['timestamps'], operation: ['createTimestamp'] } },
	},
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the employee',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'Date (Timestamp)',
		name: 'date',
		type: 'number' as const,
		default: 0,
		description: 'Timestamp (integer) for the timestamp date',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'State',
		name: 'state',
		type: 'options' as const,
		options: [
			{ name: 'ON', value: 'ON' },
			{ name: 'OFF', value: 'OFF' },
			{ name: 'PAUSE_START', value: 'PAUSE_START' },
			{ name: 'PAUSE_END', value: 'PAUSE_END' },
		],
		default: 'ON',
		description: 'Determines the state for the timestamp',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options' as const,
		options: [
			{ name: 'WORK', value: 'WORK' },
			{ name: 'INHOUSE', value: 'INHOUSE' },
			{ name: 'ERRAND', value: 'ERRAND' },
			{ name: 'VACATION', value: 'VACATION' },
			{ name: 'ILLNESS', value: 'ILLNESS' },
			{ name: 'ABSENCE_PAID', value: 'ABSENCE_PAID' },
			{ name: 'ABSENCE_UNPAID', value: 'ABSENCE_UNPAID' },
			{ name: 'OVERTIME', value: 'OVERTIME' },
			{ name: 'DOCUMENTED_SUPPORT', value: 'DOCUMENTED_SUPPORT' },
		],
		default: 'WORK',
		description: 'Determines the type for the timestamp',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createTimestamp', 'updateTimestamp'] },
		},
	},

	// updateTimestamp path param
	{
		displayName: 'Timestamp ID',
		name: 'timestampId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the timestamp to edit',
		displayOptions: { show: { resource: ['timestamps'], operation: ['updateTimestamp'] } },
	},

	// saveDayTimestamps fields
	{
		displayName: 'Employee ID (Day)',
		name: 'employeeIdDay',
		type: 'number' as const,
		default: 0,
		description: 'Employee ID for saving day timestamps (path param)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},
	{
		displayName: 'Day',
		name: 'day',
		type: 'string' as const,
		default: '',
		description: 'Day in YYYY-mm-dd format',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},
	{
		displayName: 'Timestamps JSON',
		name: 'timestampsJson',
		type: 'string' as const,
		default: '[]',
		description: 'JSON array of timestamp objects to save for the day (see docs)',
		displayOptions: { show: { resource: ['timestamps'], operation: ['saveDayTimestamps'] } },
	},

	// dayClosing create/delete payload
	{
		displayName: 'Day Closings JSON',
		name: 'dayClosingsJson',
		type: 'string' as const,
		default: '[]',
		description:
			'JSON array of day closing identifiers [{ "employeeId": 1, "date":"YYYY-mm-dd" }, ...]',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosing', 'deleteDayClosing'] },
		},
	},

	// createDayClosingsTillDate fields
	{
		displayName: 'Till Date',
		name: 'tillDate',
		type: 'string' as const,
		default: '',
		description: 'End date (YYYY-MM-DD) to create dayClosings till',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosingsTillDate'] },
		},
	},
	{
		displayName: 'Employee IDs JSON',
		name: 'employeeIdsJson',
		type: 'string' as const,
		default: '[]',
		description: 'JSON array of integers: employee IDs to create dayClosings for',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createDayClosingsTillDate'] },
		},
	},

	// setInitialBalance fields
	{
		displayName: 'Employee ID (Initial)',
		name: 'employeeIdInitial',
		type: 'number' as const,
		default: 0,
		description: 'Employee ID (path param) for initial balance',
		displayOptions: { show: { resource: ['timestamps'], operation: ['setInitialBalance'] } },
	},
	{
		displayName: 'Initial Balance (Minutes)',
		name: 'initialBalance',
		type: 'number' as const,
		default: 0,
		description: 'Initial balance in minutes',
		displayOptions: { show: { resource: ['timestamps'], operation: ['setInitialBalance'] } },
	},

	// pauseConfigs fields
	{
		displayName: 'Pause Config ID',
		name: 'pauseConfigId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the pause config (for update/delete)',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['updatePauseConfig', 'deletePauseConfig'] },
		},
	},
	{
		displayName: 'From Minutes',
		name: 'fromMinutes',
		type: 'number' as const,
		default: 0,
		description: 'Minutes needed to require a minimum pause',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createPauseConfig', 'updatePauseConfig'] },
		},
	},
	{
		displayName: 'Minimum Pause (Minutes)',
		name: 'minimumPause',
		type: 'number' as const,
		default: 0,
		description: 'Minimum pause in minutes',
		displayOptions: {
			show: { resource: ['timestamps'], operation: ['createPauseConfig', 'updatePauseConfig'] },
		},
	},
];

export const handleTimestamps = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getPauseConfigs: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'timestamps/pauseConfigs',
		},

		deletePauseConfig: {
			fields: {
				pauseConfigId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'timestamps/pauseConfigs/{pauseConfigId}',
		},

		createPauseConfig: {
			fields: {
				pauseConfigId: {
					location: 'body',
					locationName: 'id',
					guard: ApiQuirks.requiresIdOnCreate ? positiveNumberGuard : discardGuard,
				},
				fromMinutes: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				minimumPause: {
					location: 'body',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'timestamps/pauseConfigs',
		},

		updatePauseConfig: {
			fields: {
				pauseConfigId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				fromMinutes: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
				minimumPause: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'timestamps/pauseConfigs/{pauseConfigId}',
		},

		setInitialBalance: {
			fields: {
				employeeIdInitial: {
					location: 'path',
					locationName: 'employeeId',
					guard: positiveNumberGuard,
				},
				initialBalance: {
					location: 'body',
					locationName: 'balance',
					guard: numberGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'timestamps/employee/{employeeId}/initialBalance',
		},

		createDayClosingsTillDate: {
			fields: {
				tillDate: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
				employeeIdsJson: {
					location: 'body',
					locationName: 'employeeIds',
					guard: jsonGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'timestamps/dayClosing/tillDate',
		},

		getDayClosingTillDate: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'timestamps/dayClosing/tillDate',
		},

		deleteDayClosing: {
			fields: {
				dayClosingsJson: {
					location: 'body',
					locationName: 'dayClosings',
					spread: true,
					guard: jsonAndGuard(
						arrayGuard(
							createSubObjectGuard(
								{
									employeeId: {
										guard: positiveNumberGuard,
									},
									date: {
										guard: nonEmptyStringGuard,
									},
								},
								{ allowEmpty: false },
							),
						),
					),
				},
			},
			httpMethod: 'DELETE',
			subPath: 'timestamps/dayClosing',
		},

		createDayClosing: {
			fields: {
				dayClosingsJson: {
					location: 'body',
					locationName: 'dayClosings',
					spread: true,
					guard: jsonAndGuard(
						arrayGuard(
							createSubObjectGuard(
								{
									employeeId: {
										guard: positiveNumberGuard,
									},
									date: {
										guard: nonEmptyStringGuard,
									},
								},
								{ allowEmpty: false },
							),
						),
					),
				},
			},
			httpMethod: 'POST',
			subPath: 'timestamps/dayClosing',
		},

		saveDayTimestamps: {
			fields: {
				employeeIdDay: {
					location: 'path',
					locationName: 'employeeId',
					guard: positiveNumberGuard,
				},
				day: {
					location: 'path',
					guard: nonEmptyStringGuard,
				},
				timestampsJson: {
					location: 'body',
					locationName: 'timestamps',
					spread: true,
					guard: jsonAndGuard(
						arrayGuard(
							createSubObjectGuard(
								{
									id: { guard: nullOrGuard(positiveNumberGuard) },
									employeeId: {
										guard: ApiQuirks.requiresIdInPathAndBody ? positiveNumberGuard : discardGuard,
									},
									date: { guard: positiveNumberGuard },
									state: { guard: nonEmptyStringGuard },
									type: { guard: nonEmptyStringGuard },
								},
								{ allowEmpty: true },
							),
						),
					),
				},
			},
			httpMethod: 'PUT',
			subPath: 'timestamps/{employeeId}/day/{day}',
		},

		updateTimestamp: {
			fields: {
				timestampId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				employeeId: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
				date: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
				state: {
					location: 'body',
					guard: nullOrGuard(nonEmptyStringGuard),
				},
				type: {
					location: 'body',
					guard: nullOrGuard(nonEmptyStringGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'timestamps/{timestampId}',
		},

		createTimestamp: {
			fields: {
				autoPause: {
					location: 'query',
					defaultValue: false,
					guard: booleanGuard,
				},
				employeeId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				date: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				state: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
				type: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'timestamps',
		},

		getTimestampStatistics: {
			fields: {
				from: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				till: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				employeeIds: {
					location: 'query',
					guard: nonEmptyStringGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'timestamps/statistics',
		},

		getTimestamps: {
			fields: {
				from: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				till: {
					location: 'query',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'timestamps',
		},

		getTimestampInfo: {
			fields: {
				from: {
					location: 'query',
					guard: positiveNumberGuard,
				},
				till: {
					location: 'query',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'timestamps/info',
		},
	},
});
