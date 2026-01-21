import { INodeProperties } from 'n8n-workflow';
import { nonEmptyRecordGuard, numberGuard } from '../lib';
import { createCrudHandler, crudField, crudOperation } from '../lib/crud';

export const hddTypesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['hddTypes'] } },
		options: [
			{
				name: 'Create HDD Type',
				value: 'createHddType',
				description: 'Creates a new hdd type',
				action: 'Create an HDD type',
			},
			{
				name: 'Delete HDD Type',
				value: 'deleteHddType',
				description: 'Deletes a hdd type',
				action: 'Delete an HDD type',
			},
			{
				name: 'Get All HDD Types',
				value: 'getAllHddTypes',
				description: 'Gets a list of all hdd types',
				action: 'Get all HDD types',
			},
			{
				name: 'Get HDD Type',
				value: 'getHddTypeById',
				description: 'Gets a specific hdd type',
				action: 'Get an HDD type',
			},
			{
				name: 'Update HDD Type',
				value: 'updateHddType',
				description: 'Updates an existing hdd type',
				action: 'Update an HDD type',
			},
		],
		default: 'getAllHddTypes',
	},
];

export const hddTypesFields: INodeProperties[] = [
	{
		displayName: 'HDD Type ID',
		name: 'hddTypeId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the HDD type',
		displayOptions: {
			show: {
				resource: ['hddTypes'],
				operation: ['updateHddType', 'getHddTypeById', 'deleteHddType'],
			},
		},
	},
	{
		displayName: 'Create HDD Type Fields',
		name: 'createHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['createHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update HDD Type Fields',
		name: 'updateHddTypeFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['hddTypes'], operation: ['updateHddType'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export const handleHddTypes = createCrudHandler({
	operationField: {
		name: 'operation',
	},
	operations: [
		crudOperation({
			type: 'create',
			operationName: 'createHddType',
			fields: [
				crudField({
					name: 'createHddTypeFields',
					location: 'body',
					defaultValue: {},
					validator: nonEmptyRecordGuard,
				}),
			],
			httpMethod: 'POST',
			subPath: 'hddTypes',
		}),
		crudOperation({
			type: 'delete',
			operationName: 'deleteHddType',
			fields: [
				crudField({
					name: 'hddTypeId',
					location: 'path',
					defaultValue: 0,
					validator: numberGuard,
				}),
			],
			httpMethod: 'DELETE',
			subPath: 'hddTypes/{hddTypeId}',
		}),
		crudOperation({
			type: 'read',
			operationName: 'getAllHddTypes',
			fields: [],
			httpMethod: 'GET',
			subPath: 'hddTypes',
		}),
		crudOperation({
			type: 'read',
			operationName: 'getHddTypeById',
			fields: [
				crudField({
					name: 'hddTypeId',
					location: 'path',
					defaultValue: 0,
					validator: numberGuard,
				}),
			],
			httpMethod: 'GET',
			subPath: 'hddTypes/{hddTypeId}',
		}),
		crudOperation({
			type: 'update',
			operationName: 'updateHddType',
			fields: [
				crudField({
					name: 'hddTypeId',
					location: 'path',
					defaultValue: 0,
					validator: numberGuard,
				}),
				crudField({
					name: 'updateHddTypeFields',
					location: 'body',
					defaultValue: {},
					validator: nonEmptyRecordGuard,
				}),
			],
			httpMethod: 'PUT',
			subPath: 'hddTypes/{hddTypeId}',
		}),
	],
});
