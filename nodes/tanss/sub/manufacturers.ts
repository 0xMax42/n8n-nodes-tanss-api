import { INodeProperties } from 'n8n-workflow';
import {
	numberGuard,
	createCrudHandler,
	CrudFieldMap,
	createSubObjectGuard,
	nullOrGuard,
	stringGuard,
	positiveNumberGuard,
	nonEmptyStringGuard,
} from '../lib';

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

const manufacturerIdField = {
	manufacturerId: {
		location: 'path',
		defaultValue: 0,
		guard: numberGuard,
	},
} satisfies CrudFieldMap;

const createManufacturerFields = {
	createManufacturerFields: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			id: {
				guard: positiveNumberGuard,
			},
			name: {
				guard: nonEmptyStringGuard,
			},
		}),
	},
} satisfies CrudFieldMap;

const updateManufacturerFields = {
	updateManufacturerFields: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			id: {
				guard: nullOrGuard(positiveNumberGuard),
			},
			name: {
				guard: nullOrGuard(stringGuard),
			},
		}),
	},
} satisfies CrudFieldMap;

export const handleManufacturers = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		createManufacturer: {
			fields: createManufacturerFields,
			httpMethod: 'POST',
			subPath: 'manufacturers',
		},

		deleteManufacturer: {
			fields: manufacturerIdField,
			httpMethod: 'DELETE',
			subPath: 'manufacturers/{manufacturerId}',
		},

		getAllManufacturers: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'manufacturers',
		},

		getManufacturerById: {
			fields: manufacturerIdField,
			httpMethod: 'GET',
			subPath: 'manufacturers/{manufacturerId}',
		},

		updateManufacturer: {
			fields: {
				...manufacturerIdField,
				...updateManufacturerFields,
			},
			httpMethod: 'PUT',
			subPath: 'manufacturers/{manufacturerId}',
		},
	},
});
