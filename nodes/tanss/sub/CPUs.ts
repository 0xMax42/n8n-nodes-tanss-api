import { INodeProperties } from 'n8n-workflow';
import {
	createCrudHandler,
	createSubObjectGuard,
	CrudFieldMap,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const cpuOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['cpus'] } },
		options: [
			{
				name: 'Create CPU',
				value: 'createCpu',
				description: 'Creates a new CPU',
				action: 'Create a CPU',
			},
			{
				name: 'Delete CPU',
				value: 'deleteCpu',
				description: 'Deletes a CPU',
				action: 'Delete a CPU',
			},
			{
				name: 'Get All CPUs',
				value: 'getAllCpus',
				description: 'Gets a list of all CPUs',
				action: 'Get all CPUs',
			},
			{
				name: 'Get CPU',
				value: 'getCpuById',
				description: 'Gets a specific CPU',
				action: 'Get a CPU',
			},
			{
				name: 'Update CPU',
				value: 'updateCpu',
				description: 'Updates an existing CPU',
				action: 'Update a CPU',
			},
		],
		default: 'getAllCpus',
	},
];

export const cpuFields: INodeProperties[] = [
	{
		displayName: 'CPU ID',
		name: 'cpuId',
		type: 'number' as const,
		default: 0,
		description: 'ID of the CPU',
		displayOptions: {
			show: { resource: ['cpus'], operation: ['updateCpu', 'getCpuById', 'deleteCpu'] },
		},
	},
	{
		displayName: 'Create CPU Fields',
		name: 'createCpuFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['cpus'], operation: ['createCpu'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
	{
		displayName: 'Update CPU Fields',
		name: 'updateCpuFields',
		type: 'collection' as const,
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['cpus'], operation: ['updateCpu'] } },
		options: [
			{ displayName: 'ID', name: 'id', type: 'number' as const, default: 0 },
			{ displayName: 'Name', name: 'name', type: 'string' as const, default: '' },
		],
	},
];

const cpuIdField = {
	cpuId: {
		location: 'path',
		guard: positiveNumberGuard,
	},
} satisfies CrudFieldMap;

const createCpuFields = {
	createCpuFields: {
		location: 'body',
		spread: true,
		guard: createSubObjectGuard({
			id: {
				guard: positiveNumberGuard,
			},
			name: {
				guard: stringGuard,
			},
		}),
	},
} satisfies CrudFieldMap;

const updateCpuFields = {
	updateCpuFields: {
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

export const handleCpu = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		createCpu: {
			httpMethod: 'POST',
			subPath: '/cpus',
			fields: createCpuFields,
		},
		deleteCpu: {
			httpMethod: 'DELETE',
			subPath: '/cpus/{cpuId}',
			fields: {
				...cpuIdField,
			},
		},
		getAllCpus: {
			httpMethod: 'GET',
			subPath: '/cpus',
			fields: {},
		},
		getCpuById: {
			httpMethod: 'GET',
			subPath: '/cpus/{cpuId}',
			fields: {
				...cpuIdField,
			},
		},
		updateCpu: {
			httpMethod: 'PUT',
			subPath: '/cpus/{cpuId}',
			fields: {
				...cpuIdField,
				...updateCpuFields,
			},
		},
	},
});
