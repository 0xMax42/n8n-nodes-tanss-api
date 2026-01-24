import { INodeProperties } from 'n8n-workflow';
import { createCrudHandler, nonEmptyRecordGuard, nullOrGuard, positiveNumberGuard } from '../lib';

export const operatingSystemsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['operatingSystems'] } },
		options: [
			{
				name: 'Create OS',
				value: 'createOs',
				description: 'Creates a new operating system',
				action: 'Create an OS',
			},
			{
				name: 'Delete OS',
				value: 'deleteOs',
				description: 'Deletes a specific operating system',
				action: 'Delete an OS',
			},
			{
				name: 'Get All OS',
				value: 'getAllOs',
				description: 'Gets a list of all operating systems',
				action: 'Get all OS',
			},
			{
				name: 'Get OS',
				value: 'getOsById',
				description: 'Gets a specific operating system',
				action: 'Get an OS',
			},
			{
				name: 'Update OS',
				value: 'updateOs',
				description: 'Updates an existing operating system',
				action: 'Update an OS',
			},
		],
		default: 'getAllOs',
	},
];

export const operatingSystemsFields: INodeProperties[] = [
	{
		displayName: 'OS ID',
		name: 'osId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the operating system',
		displayOptions: {
			show: { resource: ['operatingSystems'], operation: ['updateOs', 'getOsById', 'deleteOs'] },
		},
	},
	{
		displayName: 'Create OS Fields',
		name: 'createOsFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['operatingSystems'], operation: ['createOs'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{
				displayName: 'Server Operating System',
				name: 'serverOperatingSystem',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string' as const,
				default: '',
			},
		],
	},
	{
		displayName: 'Update OS Fields',
		name: 'updateOsFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['operatingSystems'], operation: ['updateOs'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
			{
				displayName: 'Server Operating System',
				name: 'serverOperatingSystem',
				type: 'boolean' as const,
				default: false,
			},
			{ displayName: 'Active', name: 'active', type: 'boolean' as const, default: true },
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string' as const,
				default: '',
			},
		],
	},
];

export const handleOperatingSystems = createCrudHandler({
	operationField: 'operation',
	credentialType: 'system',

	operations: {
		getAllOs: {
			httpMethod: 'GET',
			subPath: 'os',
			fields: {},
		},

		getOsById: {
			httpMethod: 'GET',
			subPath: 'os/{osId}',
			fields: {
				osId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
		},

		deleteOs: {
			httpMethod: 'DELETE',
			subPath: 'os/{osId}',
			fields: {
				osId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
		},

		updateOs: {
			httpMethod: 'PUT',
			subPath: 'os/{osId}',
			fields: {
				osId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				updateOsFields: {
					location: 'body',
					spread: true,
					guard: nullOrGuard(nonEmptyRecordGuard),
				},
			},
		},

		createOs: {
			httpMethod: 'POST',
			subPath: 'os',
			fields: {
				createOsFields: {
					location: 'body',
					spread: true,
					guard: nonEmptyRecordGuard,
				},
			},
		},
	},
});
