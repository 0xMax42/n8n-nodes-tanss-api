import { INodeProperties } from 'n8n-workflow';
import { nonEmptyRecordGuard, numberGuard, createCrudHandler } from '../lib';

export const manufacturersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['manufacturers'] } },
		options: [
			{
				name: 'Create Manufacturer',
				value: 'createManufacturer',
				description: 'Creates a new manufacturer',
				action: 'Create a manufacturer',
			},
			{
				name: 'Delete Manufacturer',
				value: 'deleteManufacturer',
				description: 'Deletes a manufacturer',
				action: 'Delete a manufacturer',
			},
			{
				name: 'Get All Manufacturers',
				value: 'getAllManufacturers',
				description: 'Gets a list of all manufacturers',
				action: 'Get all manufacturers',
			},
			{
				name: 'Get Manufacturer',
				value: 'getManufacturerById',
				description: 'Gets a specific manufacturer',
				action: 'Get a manufacturer',
			},
			{
				name: 'Update Manufacturer',
				value: 'updateManufacturer',
				description: 'Updates an existing manufacturer',
				action: 'Update a manufacturer',
			},
		],
		default: 'getAllManufacturers',
	},
];

export const manufacturersFields: INodeProperties[] = [
	{
		displayName: 'Manufacturer ID',
		name: 'manufacturerId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the manufacturer',
		displayOptions: {
			show: {
				resource: ['manufacturers'],
				operation: ['updateManufacturer', 'getManufacturerById', 'deleteManufacturer'],
			},
		},
	},
	{
		displayName: 'Create Manufacturer Fields',
		name: 'createManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['createManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update Manufacturer Fields',
		name: 'updateManufacturerFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['manufacturers'], operation: ['updateManufacturer'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

export const handleManufacturers = createCrudHandler({
	operationField: 'operation',

	operations: {
		createManufacturer: {
			fields: {
				createManufacturerFields: {
					location: 'body',
					defaultValue: {},
					guard: nonEmptyRecordGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'manufacturers',
		},

		deleteManufacturer: {
			fields: {
				manufacturerId: {
					location: 'path',
					defaultValue: 0,
					guard: numberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'manufacturers/{manufacturerId}',
		},

		getAllManufacturers: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'manufacturers',
		},

		getManufacturerById: {
			fields: {
				manufacturerId: {
					location: 'path',
					defaultValue: 0,
					guard: numberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'manufacturers/{manufacturerId}',
		},

		updateManufacturer: {
			fields: {
				manufacturerId: {
					location: 'path',
					defaultValue: 0,
					guard: numberGuard,
				},
				updateManufacturerFields: {
					location: 'body',
					defaultValue: {},
					guard: nonEmptyRecordGuard,
				},
			},
			httpMethod: 'PUT',
			subPath: 'manufacturers/{manufacturerId}',
		},
	},
});
