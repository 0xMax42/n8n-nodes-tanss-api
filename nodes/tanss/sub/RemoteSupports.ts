import { INodeProperties } from 'n8n-workflow';
import {
	createCrudHandler,
	createSubObjectGuard,
	CrudFieldMap,
	nonEmptyStringGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const remoteSupportsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['remoteSupports'] },
		},
		options: [
			{
				name: 'Create / Import Remote Support',
				value: 'createRemoteSupport',
				description: 'Creates/imports a remote support into the TANSS database',
				action: 'Create remote support',
			},
			{
				name: 'Create Device Assignment',
				value: 'createAssignDevice',
				description: 'Creates a device assignment mapping deviceId -> company/link',
				action: 'Create device assignment',
			},
			{
				name: 'Create Technician Assignment',
				value: 'createAssignEmployee',
				description: 'Creates an assignment mapping userId -> employeeId',
				action: 'Create technician assignment',
			},
			{
				name: 'Delete Device Assignment',
				value: 'deleteAssignDevice',
				description: 'Deletes a device assignment by deviceId',
				action: 'Delete device assignment',
			},
			{
				name: 'Delete Remote Support',
				value: 'deleteRemoteSupport',
				description: 'Deletes a remote support by ID',
				action: 'Delete remote support',
			},
			{
				name: 'Delete Technician Assignment',
				value: 'deleteAssignEmployee',
				description: 'Deletes a technician assignment by userId',
				action: 'Delete technician assignment',
			},
			{
				name: 'Get Device Assignments',
				value: 'getDeviceAssignments',
				description: 'Gets all device assignments for the remote support type',
				action: 'Get device assignments',
			},
			{
				name: 'Get List of Remote Supports',
				value: 'getRemoteSupports',
				description: 'Gets a list of remote supports based on filter settings',
				action: 'Get remote supports',
			},
			{
				name: 'Get Remote Support by ID',
				value: 'getRemoteSupportById',
				description: 'Gets a remote support from the database by its ID',
				action: 'Get remote support by id',
			},
			{
				name: 'Get Technician Assignments',
				value: 'getEmployeeAssignments',
				description: 'Gets all employee (technician) assignments for the remote support type',
				action: 'Get technician assignments',
			},
			{
				name: 'Update Remote Support',
				value: 'updateRemoteSupport',
				description: 'Updates a remote support by ID and sets the new values',
				action: 'Update remote support',
			},
		],
		default: 'createRemoteSupport',
	},
];

export const remoteSupportsFields: INodeProperties[] = [
	{
		displayName: 'Assign Device Object',
		name: 'assignDeviceObject',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createAssignDevice', 'deleteAssignDevice'],
			},
		},
		default: {},
		options: [
			{ displayName: 'deviceId', name: 'deviceId', type: 'string', default: '' },
			{ displayName: 'companyId', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number', default: 0 },
			{ displayName: 'linkId', name: 'linkId', type: 'number', default: 0 },
		],
	},

	{
		displayName: 'Assign Employee Object',
		name: 'assignEmployeeObject',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createAssignEmployee', 'deleteAssignEmployee'],
			},
		},
		default: {},
		options: [
			{ displayName: 'userId', name: 'userId', type: 'string', default: '' },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number', default: 0 },
		],
	},

	{
		displayName: 'Filter Settings',
		name: 'getRemoteSupportsFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: { show: { resource: ['remoteSupports'], operation: ['getRemoteSupports'] } },
		default: {},
		options: [
			{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number', default: 0 },
			{ displayName: 'Text', name: 'text', type: 'string', default: '' },
			{
				displayName: 'Timeframe From (Timestamp)',
				name: 'timeFrom',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Timeframe To (Timestamp)',
				name: 'timeTo',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Type ID', name: 'typeId', type: 'number', default: 0 },
		],
	},

	{
		displayName: 'Remote Object',
		name: 'remoteObject',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['createRemoteSupport', 'updateRemoteSupport'],
			},
		},
		default: {},
		options: [
			{ displayName: 'Comment', name: 'comment', type: 'string', default: '' },
			{ displayName: 'companyId', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'deviceId', name: 'deviceId', type: 'string', default: '' },
			{ displayName: 'deviceName', name: 'deviceName', type: 'string', default: '' },
			{ displayName: 'employeeId', name: 'employeeId', type: 'number', default: 0 },
			{ displayName: 'endTime (Timestamp)', name: 'endTime', type: 'number', default: 0 },
			{ displayName: 'linkId', name: 'linkId', type: 'number', default: 0 },
			{ displayName: 'linkTypeId', name: 'linkTypeId', type: 'number', default: 0 },
			{
				displayName: 'remoteMaintenanceId',
				name: 'remoteMaintenanceId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'startTime (Timestamp)',
				name: 'startTime',
				type: 'number',
				default: 0,
			},
			{ displayName: 'userId', name: 'userId', type: 'string', default: '' },
			{ displayName: 'userName', name: 'userName', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Remote Support ID',
		name: 'remoteSupportId',
		type: 'number',
		default: 0,
		description: 'ID of the remote support to fetch / update / delete',
		displayOptions: {
			show: {
				resource: ['remoteSupports'],
				operation: ['getRemoteSupportById', 'updateRemoteSupport', 'deleteRemoteSupport'],
			},
		},
	},
];

const remoteSupportIdField = {
	remoteSupportId: {
		location: 'path',
		guard: positiveNumberGuard,
	},
} satisfies CrudFieldMap;

const getRemoteSupportsFilters = {
	getRemoteSupportsFilters: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard({
			timeFrom: { guard: nullOrGuard(positiveNumberGuard) },
			timeTo: { guard: nullOrGuard(positiveNumberGuard) },
			employeeId: { guard: nullOrGuard(positiveNumberGuard) },
			companyId: { guard: nullOrGuard(positiveNumberGuard) },
			typeId: { guard: nullOrGuard(positiveNumberGuard) },
			text: { guard: nullOrGuard(nonEmptyStringGuard) },
		}),
	},
} satisfies CrudFieldMap;

const createOrUpdateRemoteSupportFields = {
	remoteObject: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard({
			remoteMaintenanceId: { guard: nullOrGuard(nonEmptyStringGuard) },
			userId: { guard: nullOrGuard(stringGuard) },
			userName: { guard: nullOrGuard(nonEmptyStringGuard) },
			employeeId: { guard: nullOrGuard(positiveNumberGuard) },
			deviceId: { guard: nullOrGuard(stringGuard) },
			deviceName: { guard: nullOrGuard(nonEmptyStringGuard) },
			companyId: { guard: nullOrGuard(positiveNumberGuard) },
			linkTypeId: { guard: nullOrGuard(positiveNumberGuard) },
			linkId: { guard: nullOrGuard(positiveNumberGuard) },
			startTime: { guard: nullOrGuard(positiveNumberGuard) },
			endTime: { guard: nullOrGuard(positiveNumberGuard) },
			comment: { guard: nullOrGuard(nonEmptyStringGuard) },
		}),
	},
} satisfies CrudFieldMap;

const createAssignDeviceFields = {
	assignDeviceObject: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard({
			deviceId: { guard: nonEmptyStringGuard },
			companyId: { guard: nullOrGuard(positiveNumberGuard) },
			linkTypeId: { guard: nullOrGuard(positiveNumberGuard) },
			linkId: { guard: nullOrGuard(positiveNumberGuard) },
		}),
	},
} satisfies CrudFieldMap;

export const handleRemoteSupports = createCrudHandler({
	operationField: 'operation',
	credentialType: 'system',

	operations: {
		getDeviceAssignments: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'remoteSupports/v1/assignDevice',
			basePath: 'backend/api',
		},

		getRemoteSupportById: {
			fields: remoteSupportIdField,
			httpMethod: 'GET',
			subPath: 'remoteSupports/v1/{remoteSupportId}',
			basePath: 'backend/api',
		},

		deleteRemoteSupport: {
			fields: remoteSupportIdField,
			httpMethod: 'DELETE',
			subPath: 'remoteSupports/v1/{remoteSupportId}',
			basePath: 'backend/api',
		},

		getRemoteSupports: {
			fields: getRemoteSupportsFilters,
			httpMethod: 'PUT',
			subPath: 'remoteSupports/v1',
			basePath: 'backend/api',
		},

		createRemoteSupport: {
			fields: createOrUpdateRemoteSupportFields,
			httpMethod: 'POST',
			subPath: 'remoteSupports/v1',
			basePath: 'backend/api',
		},

		updateRemoteSupport: {
			fields: { ...remoteSupportIdField, ...createOrUpdateRemoteSupportFields },
			httpMethod: 'PUT',
			subPath: 'remoteSupports/v1/{remoteSupportId}',
			basePath: 'backend/api',
		},

		deleteAssignDevice: {
			fields: {
				assignDeviceObject: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: createSubObjectGuard({
						deviceId: { guard: nonEmptyStringGuard },
					}),
				},
			},
			httpMethod: 'DELETE',
			subPath: 'remoteSupports/v1/assignDevice',
			basePath: 'backend/api',
		},

		createAssignDevice: {
			fields: createAssignDeviceFields,
			httpMethod: 'POST',
			subPath: 'remoteSupports/v1/assignDevice',
			basePath: 'backend/api',
		},

		getEmployeeAssignments: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'remoteSupports/v1/assignEmployee',
			basePath: 'backend/api',
		},

		createAssignEmployee: {
			fields: {
				assignEmployeeObject: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: createSubObjectGuard({
						userId: { guard: nonEmptyStringGuard },
						employeeId: { guard: positiveNumberGuard },
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'remoteSupports/v1/assignEmployee',
			basePath: 'backend/api',
		},

		deleteAssignEmployee: {
			fields: {
				assignEmployeeObject: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: createSubObjectGuard({
						userId: { guard: nonEmptyStringGuard },
					}),
				},
			},
			httpMethod: 'DELETE',
			subPath: 'remoteSupports/v1/assignEmployee',
			basePath: 'backend/api',
		},
	},
});

// export async function handleRemoteSupports(this: IExecuteFunctions, i: number) {
// 	const operation = this.getNodeParameter('operation', i) as string;
// 	const credentials = await this.getCredentials('tanssApi');
// 	if (!credentials) throw new NodeOperationError(this.getNode(), 'No credentials returned!');

// 	const apiToken = this.getNodeParameter('apiToken', i, '') as string;
// 	const base = credentials.baseURL as string;
// 	if (!base) throw new NodeOperationError(this.getNode(), 'No baseURL in credentials');

// 	let url = '';
// 	const requestOptions: {
// 		method: 'GET' | 'PUT' | 'POST' | 'DELETE';
// 		headers: { [key: string]: string };
// 		json: boolean;
// 		body?: IDataObject;
// 		url: string;
// 	} = {
// 		method: 'POST',
// 		headers: { Accept: 'application/json' },
// 		json: true,
// 		url,
// 	};

// 	if (apiToken && apiToken.toString().trim() !== '') {
// 		const tokenValue = String(apiToken).startsWith('Bearer ')
// 			? String(apiToken)
// 			: `Bearer ${String(apiToken)}`;
// 		requestOptions.headers.Authorization = tokenValue;
// 		requestOptions.headers.apiToken = tokenValue;
// 	}

// 	switch (operation) {
// 		case 'createAssignDevice': {
// 			const assignJson = this.getNodeParameter('assignDeviceJson', i, '') as string;
// 			let body: IDataObject = {};
// 			if (assignJson && assignJson.trim() !== '') {
// 				try {
// 					const parsed = JSON.parse(assignJson);
// 					if (typeof parsed !== 'object' || parsed === null)
// 						throw new Error('assignDeviceJson must be a JSON object.');
// 					body = parsed as IDataObject;
// 				} catch (err) {
// 					const msg = err instanceof Error ? err.message : String(err);
// 					throw new NodeOperationError(
// 						this.getNode(),
// 						`assignDeviceJson must be valid JSON: ${msg}`,
// 					);
// 				}
// 			} else {
// 				const fields = this.getNodeParameter('assignDeviceObject', i, {}) as IDataObject;
// 				if (fields.deviceId && String(fields.deviceId).trim() !== '')
// 					body.deviceId = String(fields.deviceId).trim();
// 				const companyId = Number(fields.companyId) || 0;
// 				if (companyId > 0) body.companyId = companyId;
// 				const linkTypeId = Number(fields.linkTypeId) || 0;
// 				if (linkTypeId > 0) body.linkTypeId = linkTypeId;
// 				const linkId = Number(fields.linkId) || 0;
// 				if (linkId > 0) body.linkId = linkId;
// 			}

// 			url = `${credentials.baseURL}/backend/api/remoteSupports/v1/assignDevice`;
// 			requestOptions.method = 'POST';
// 			requestOptions.url = url;
// 			requestOptions.headers['Content-Type'] = 'application/json';
// 			requestOptions.body = body;
// 			break;
// 		}

// 		default:
// 			throw new NodeOperationError(
// 				this.getNode(),
// 				`The operation "${operation}" is not recognized.`,
// 			);
// 	}

// 	try {
// 		const responseData = await this.helpers.httpRequest(
// 			requestOptions as unknown as import('n8n-workflow').IHttpRequestOptions,
// 		);
// 		return responseData;
// 	} catch (error: unknown) {
// 		const message = error instanceof Error ? error.message : String(error);
// 		throw new NodeOperationError(this.getNode(), `Failed to execute ${operation}: ${message}`);
// 	}
// }
