import { INodeProperties } from 'n8n-workflow';
import {
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const componentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['component'],
			},
		},
		options: [
			{
				name: 'Create Component',
				value: 'createComponent',
				description: 'Create a new component',
				action: 'Create a component',
			},
			{
				name: 'Create Component Type',
				value: 'createComponentType',
				description: 'Create a new component type',
				action: 'Create a component type',
			},
			{
				name: 'Delete Component',
				value: 'deleteComponent',
				description: 'Delete a component',
				action: 'Delete a component',
			},
			{
				name: 'Delete Component Type',
				value: 'deleteComponentType',
				description: 'Delete a component type',
				action: 'Delete a component type',
			},
			{
				name: 'Get Component',
				value: 'getComponent',
				description: 'Get a component by ID',
				action: 'Get a component',
			},
			{
				name: 'Get Component Types',
				value: 'getComponentTypes',
				description: 'Get a list of component types',
				action: 'Get component types',
			},
			{
				name: 'Get Many Components',
				value: 'getManyComponents',
				action: 'Get many components',
			},
			{
				name: 'Update Component',
				value: 'updateComponent',
				description: 'Update a component',
				action: 'Update a component',
			},
			{
				name: 'Update Component Type',
				value: 'updateComponentType',
				description: 'Update a component type',
				action: 'Update a component type',
			},
		],
		default: 'getComponent',
	},
];
export const componentFields: INodeProperties[] = [
	{
		displayName: 'Component ID',
		name: 'componentId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the component',
		displayOptions: {
			show: {
				resource: ['component'],
				operation: ['getComponent', 'updateComponent', 'deleteComponent'],
			},
		},
	},
	{
		displayName: 'Update/Create Component Fields',
		name: 'componentFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['component'],
				operation: ['createComponent', 'updateComponent'],
			},
		},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the component is active',
			},
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string',
				default: '',
				description: 'Article number of the component',
			},
			{
				displayName: 'Billing Number',
				name: 'billingNumber',
				type: 'string',
				default: '',
				description: 'Billing number information for the component',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				default: 0,
				description: 'ID of the company the component is assigned to (if not built into a PC)',
			},
			{
				displayName: 'Component Type ID',
				name: 'componentTypeId',
				type: 'number',
				default: 0,
				description: 'ID of the component type',
			},
			{
				displayName: 'Date',
				name: 'date',
				type: 'dateTime',
				default: '',
				description: 'Purchase date of the component',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Miscellaneous description information for the component',
			},
			{
				displayName: 'HDD Type ID',
				name: 'hddTypeId',
				type: 'number',
				default: 0,
				description: 'ID of the HDD type',
			},
			{
				displayName: 'Inventory Number',
				name: 'inventoryNumber',
				type: 'string',
				default: '',
				description: 'Inventory number of the component',
			},
			{
				displayName: 'Manufacturer ID',
				name: 'manufacturerId',
				type: 'number',
				default: 0,
				description: 'ID of the manufacturer of the component',
			},
			{
				displayName: 'Megabytes',
				name: 'megabytes',
				type: 'number',
				default: 0,
				description: 'Capacity in megabytes (for RAM or HDDs)',
			},
			{
				displayName: 'On Board',
				name: 'onBoard',
				type: 'boolean',
				default: false,
				description: 'Whether the component is onboard',
			},
			{
				displayName: 'PC/Server ID',
				name: 'pcId',
				type: 'number',
				default: 0,
				description: 'ID of the PC/Server this component is built into',
			},
			{
				displayName: 'Periphery ID',
				name: 'peripheryId',
				type: 'number',
				default: 0,
				description: 'ID of the periphery this component is built into',
			},
			{
				displayName: 'Purchase Price',
				name: 'purchasePrice',
				type: 'number',
				default: 0,
				description: 'Purchase price of the component',
			},
			{
				displayName: 'Remark',
				name: 'remark',
				type: 'string',
				default: '',
				description: 'Remarks for the component',
			},
			{
				displayName: 'Selling Price',
				name: 'sellingPrice',
				type: 'number',
				default: 0,
				description: 'Selling price of the component',
			},
			{
				displayName: 'Serial Number',
				name: 'serialNumber',
				type: 'string',
				default: '',
				description: 'Serial number of the component',
			},
			{
				displayName: 'Storage ID',
				name: 'storageId',
				type: 'number',
				default: 0,
				description: 'ID of the storage containing the component',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Type/Model of the component',
			},
		],
	},
	{
		displayName: 'Get Components Filters',
		name: 'getComponentsFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['component'],
				operation: ['getManyComponents'],
			},
		},
		options: [
			{
				displayName: 'Active',
				name: 'active',
				type: 'options',
				options: [
					{ name: 'Active Only', value: 'ACTIVE_ONLY' },
					{ name: 'Inactive Only', value: 'INACTIVE_ONLY' },
					{ name: 'Active and Inactive', value: 'ACTIVE_AND_INACTIVE' },
				],
				default: 'ACTIVE_ONLY',
				description: 'Filter components by active state',
			},
			{
				displayName: 'Branch',
				name: 'branch',
				type: 'options',
				options: [
					{ name: 'Company Only', value: 'COMPANY_ONLY' },
					{ name: 'Branches Only', value: 'BRANCHES_ONLY' },
					{ name: 'Company and Branches', value: 'COMPANY_AND_BRANCHES' },
					{ name: 'Specific Branch', value: 'SPECIFIC_BRANCH' },
				],
				default: 'COMPANY_ONLY',
				description: 'Filter components by branch affiliation',
			},
			{
				displayName: 'Built-In Filter',
				name: 'builtInFilter',
				type: 'options',
				options: [
					{ name: 'Not Built-In Components', value: 'NOT_BUILT_IN_COMPONENTS' },
					{ name: 'Components in PCs', value: 'COMPONENTS_IN_PCS' },
					{ name: 'Components in Peripheries', value: 'COMPONENTS_IN_PERIPHERIES' },
				],
				default: 'NOT_BUILT_IN_COMPONENTS',
				description: 'Filter components by built-in state',
			},
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				default: 0,
				description: 'Filter components by company ID',
			},
			{
				displayName: 'Component Type ID',
				name: 'componentTypeId',
				type: 'number',
				default: 0,
				description: 'Filter components by component type ID',
			},
			{
				displayName: 'PC/Server ID',
				name: 'pcId',
				type: 'number',
				default: 0,
				description: 'Filter components by PC/Server ID',
			},
			{
				displayName: 'Periphery ID',
				name: 'peripheryId',
				type: 'number',
				default: 0,
				description: 'Filter components by periphery ID',
			},
		],
	},
	{
		displayName: 'Component Type ID',
		name: 'componentTypeId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the component type',
		displayOptions: {
			show: {
				resource: ['component'],
				operation: ['createComponentType', 'updateComponentType', 'deleteComponentType'],
			},
		},
	},
	{
		displayName: 'Create/Update Component Type Fields',
		name: 'componentTypeFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['component'],
				operation: ['createComponentType', 'updateComponentType'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Name of the component type',
			},
			{
				displayName: 'Short Name',
				name: 'shortName',
				type: 'string',
				default: '',
				description: 'Short name of the component type',
			},
			{
				displayName: 'Shown',
				name: 'shown',
				type: 'boolean',
				default: true,
				description: 'Whether the component type is shown in selection fields',
			},
		],
	},
];

export const handleComponents = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getComponent: {
			fields: {
				componentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'components/{componentId}',
		},

		deleteComponent: {
			fields: {
				componentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'components/{componentId}',
		},

		getManyComponents: {
			fields: {
				getComponentsFilters: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						active: {
							guard: nullOrGuard(stringGuard),
						},
						branch: {
							guard: nullOrGuard(stringGuard),
						},
						builtInFilter: {
							guard: nullOrGuard(stringGuard),
						},
						companyId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						componentTypeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						pcId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						peripheryId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: 'components',
		},

		createComponent: {
			fields: {
				componentFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						active: { guard: booleanGuard },
						articleNumber: { guard: nullOrGuard(stringGuard) },
						billingNumber: { guard: nullOrGuard(stringGuard) },
						companyId: { guard: nullOrGuard(positiveNumberGuard) },
						componentTypeId: { guard: nullOrGuard(positiveNumberGuard) },
						date: { guard: nullOrGuard(positiveNumberGuard) },
						description: { guard: nullOrGuard(stringGuard) },
						hddTypeId: { guard: nullOrGuard(positiveNumberGuard) },
						inventoryNumber: { guard: stringGuard },
						manufacturerId: { guard: nullOrGuard(positiveNumberGuard) },
						megabytes: { guard: nullOrGuard(positiveNumberGuard) },
						onBoard: { guard: booleanGuard },
						pcId: { guard: nullOrGuard(positiveNumberGuard) },
						peripheryId: { guard: nullOrGuard(positiveNumberGuard) },
						purchasePrice: { guard: nullOrGuard(positiveNumberGuard) },
						remark: { guard: stringGuard },
						sellingPrice: { guard: nullOrGuard(positiveNumberGuard) },
						serialNumber: { guard: stringGuard },
						storageId: { guard: nullOrGuard(positiveNumberGuard) },
						type: { guard: stringGuard },
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'components',
		},

		updateComponent: {
			fields: {
				componentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				componentFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						active: { guard: nullOrGuard(booleanGuard) },
						articleNumber: { guard: nullOrGuard(stringGuard) },
						billingNumber: { guard: nullOrGuard(stringGuard) },
						companyId: { guard: nullOrGuard(positiveNumberGuard) },
						componentTypeId: { guard: nullOrGuard(positiveNumberGuard) },
						date: { guard: nullOrGuard(positiveNumberGuard) },
						description: { guard: nullOrGuard(stringGuard) },
						hddTypeId: { guard: nullOrGuard(positiveNumberGuard) },
						inventoryNumber: { guard: nullOrGuard(stringGuard) },
						manufacturerId: { guard: nullOrGuard(positiveNumberGuard) },
						megabytes: { guard: nullOrGuard(positiveNumberGuard) },
						onBoard: { guard: nullOrGuard(booleanGuard) },
						pcId: { guard: nullOrGuard(positiveNumberGuard) },
						peripheryId: { guard: nullOrGuard(positiveNumberGuard) },
						purchasePrice: { guard: nullOrGuard(positiveNumberGuard) },
						remark: { guard: nullOrGuard(stringGuard) },
						sellingPrice: { guard: nullOrGuard(positiveNumberGuard) },
						serialNumber: { guard: nullOrGuard(stringGuard) },
						storageId: { guard: nullOrGuard(positiveNumberGuard) },
						type: { guard: nullOrGuard(stringGuard) },
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: 'components/{componentId}',
		},

		getComponentTypes: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'components/types',
		},

		createComponentType: {
			fields: {
				componentTypeFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						type: { guard: stringGuard },
						shortName: { guard: nullOrGuard(stringGuard) },
						shown: { guard: booleanGuard },
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'components/types',
		},

		updateComponentType: {
			fields: {
				componentTypeId: {
					location: 'path',
					locationName: 'typeId',
					guard: positiveNumberGuard,
				},
				componentTypeFields: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						type: { guard: nullOrGuard(stringGuard) },
						shortName: { guard: nullOrGuard(stringGuard) },
						shown: { guard: nullOrGuard(booleanGuard) },
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: 'components/types/{typeId}',
		},

		deleteComponentType: {
			fields: {
				componentTypeId: {
					location: 'path',
					locationName: 'typeId',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'components/types/{typeId}',
		},
	},
});
