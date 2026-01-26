import { INodeProperties } from 'n8n-workflow';
import {
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const ipsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ips'] } },
		options: [
			{
				name: 'Gets All Ip Addresses of a Device',
				value: 'getIps',
				description: 'Fetch Ip Addresses of a Device',
				action: 'Get ip addresses',
			},
			{
				name: 'Creates an Ip Address',
				value: 'createIp',
				description: 'Create a new ip address',
				action: 'Create ip address',
			},
			{
				name: 'Update Ip Address',
				value: 'updateIp',
				description: 'Update an existing ip address',
				action: 'Update ip address',
			},
			{
				name: 'Deletes an Ip Address',
				value: 'deleteIp',
				description: 'Delete an existing ip address',
				action: 'Delete ip address',
			},
		],
		default: 'getIps',
	},
];

export const ipsFields: INodeProperties[] = [
	{
		displayName: 'IP ID',
		name: 'ipId',
		required: true,
		displayOptions: { show: { resource: ['ips'], operation: ['updateIp', 'deleteIp'] } },
		type: 'number',
		default: null,
	},
	{
		displayName: 'Assignment ID',
		name: 'assignmentId',
		required: true,
		displayOptions: { show: { resource: ['ips'], operation: ['getIps', 'createIp'] } },
		type: 'number',
		default: null,
	},
	{
		displayName: 'Assignment Type',
		name: 'assignmentType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['ips'], operation: ['getIps', 'createIp'] } },
		options: [
			{ name: 'PC', value: 'PC' },
			{ name: 'Periphery', value: 'PERIPHERY' },
		],
		default: 'PC',
	},
	{
		displayName: 'Create/Update Ip Fields',
		name: 'createUpdateIpFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['ips'], operation: ['createIp', 'updateIp'] } },
		default: {},
		options: [
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'MAC Address',
				name: 'macAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Remarks',
				name: 'remarks',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Whether DHCP Is Used',
				name: 'dhcp',
				type: 'boolean',
				default: false,
			},
		],
	},
];

export const handleIps = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getIps: {
			fields: {
				assignmentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				assignmentType: {
					location: 'path',
					guard: nonEmptyStringGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'ips/{assignmentType}/{assignmentId}',
		},

		createIp: {
			fields: {
				assignmentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				assignmentType: {
					location: 'path',
					guard: nonEmptyStringGuard,
				},
				createUpdateIpFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						ipAddress: {
							locationName: 'ip',
							guard: nullOrGuard(stringGuard),
						},
						macAddress: {
							locationName: 'mac',
							guard: nullOrGuard(stringGuard),
						},
						remarks: {
							locationName: 'remark',
							guard: nullOrGuard(stringGuard),
						},
						dhcp: {
							guard: booleanGuard,
						},
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'ips/{assignmentType}/{assignmentId}',
		},

		updateIp: {
			fields: {
				ipId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				createUpdateIpFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						ipAddress: {
							locationName: 'ip',
							guard: nullOrGuard(stringGuard),
						},
						macAddress: {
							locationName: 'mac',
							guard: nullOrGuard(stringGuard),
						},
						remarks: {
							locationName: 'remark',
							guard: nullOrGuard(stringGuard),
						},
						dhcp: {
							guard: nullOrGuard(booleanGuard),
						},
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: 'ips/{ipId}',
		},

		deleteIp: {
			fields: {
				ipId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'ips/{ipId}',
		},
	},
});
