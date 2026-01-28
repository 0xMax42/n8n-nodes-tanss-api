import { INodeProperties } from 'n8n-workflow';
import {
	ApiQuirks,
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	CrudFieldMap,
	discardGuard,
	nullOrGuard,
	numberGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const peripheryOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['periphery'],
			},
		},
		options: [
			{
				name: 'Assign Periphery',
				value: 'assign',
				action: 'Assign periphery',
			},
			{
				name: 'Create Periphery',
				value: 'post',
				description: 'Creates a periphery',
				action: 'Create a periphery',
			},
			{
				name: 'Create Periphery Type',
				value: 'createType',
				action: 'Create periphery type',
			},
			{
				name: 'Delete Periphery',
				value: 'del',
				description: 'Deletes a periphery',
				action: 'Delete a periphery',
			},
			{
				name: 'Delete Periphery Assignment',
				value: 'deleteAssignment',
				action: 'Delete periphery assignment',
			},
			{
				name: 'Delete Periphery Type',
				value: 'deleteType',
				action: 'Delete periphery type',
			},
			{
				name: 'Get Periphery by ID',
				value: 'get',
				description: 'Gets a periphery by ID',
				action: 'Get a periphery by ID',
			},
			{
				name: 'Get Periphery Types',
				value: 'getTypes',
				action: 'Get periphery types',
			},
			{
				name: 'List Peripheries',
				value: 'list',
				description: 'Gets a list of peripheries',
				action: 'List peripheries',
			},
			{
				name: 'Update Periphery',
				value: 'put',
				description: 'Updates a periphery',
				action: 'Update a periphery',
			},
			{
				name: 'Update Periphery Type',
				value: 'updateType',
				action: 'Update periphery type',
			},
		],
		default: 'get',
	},
];

export const peripheryFields: INodeProperties[] = [
	{
		displayName: 'Periphery ID',
		name: 'peripheryId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the periphery',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['get', 'put', 'del', 'assign', 'deleteAssignment'],
			},
		},
	},
	{
		displayName: 'Update/Create Periphery Fields',
		name: 'peripheryFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['put', 'post'],
			},
		},
		default: {},
		options: [
			{ displayName: 'Active', name: 'active', type: 'boolean', default: true },
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Field',
				options: [
					{
						displayName: 'Additional Field ID',
						name: 'additionalFieldId',
						type: 'number',
						default: 0,
						description: 'ID of the additional field',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Title of the additional field',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the additional field',
					},
				],
			},
			{ displayName: 'Article Number', name: 'articleNumber', type: 'string', default: '' },
			{ displayName: 'Billing Number', name: 'billingNumber', type: 'string', default: '' },
			{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
			{ displayName: 'Date', name: 'date', type: 'number', default: 0 },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number', default: 0 },
			{ displayName: 'Guarantee', name: 'guarantee', type: 'json', default: '' },
			{
				displayName: 'Guarantee Info',
				name: 'guaranteeInfo',
				type: 'collection',
				default: {},
				options: [
					{
						displayName: 'Guarantee Expire',
						name: 'guaranteeExpire',
						type: 'number',
						default: 0,
					},
					{ displayName: 'Guarantee Month', name: 'guaranteeMonth', type: 'number', default: 0 },
					{ displayName: 'Link ID', name: 'linkId', type: 'number', default: 0 },
					{ displayName: 'Link Type ID', name: 'linkTypeId', type: 'number', default: 0 },
					{ displayName: 'Purchase Date', name: 'purchaseDate', type: 'number', default: 0 },
					{ displayName: 'Remark', name: 'remark', type: 'string', default: '' },
					{ displayName: 'Warranty Expire', name: 'warrantyExpire', type: 'number', default: 0 },
					{ displayName: 'Warranty Month', name: 'warrantyMonth', type: 'number', default: 0 },
				],
			},
			{ displayName: 'Internal Remark', name: 'internalRemark', type: 'string', default: '' },
			{ displayName: 'Inventory Number', name: 'inventoryNumber', type: 'string', default: '' },
			{
				displayName: 'IP Addresses',
				name: 'ipAddresses',
				type: 'fixedCollection',
				placeholder: 'Add IP Address',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{ displayName: 'DHCP', name: 'dhcp', type: 'boolean', default: false },
					{ displayName: 'ID', name: 'id', type: 'number', default: 0 },
					{ displayName: 'IP', name: 'ip', type: 'string', default: '' },
					{ displayName: 'MAC', name: 'mac', type: 'string', default: '' },
					{ displayName: 'Remark', name: 'remark', type: 'string', default: '' },
					{ displayName: 'Assignment ID', name: 'assignmentId', type: 'number', default: 0 },
					{
						displayName: 'Assignment Type',
						name: 'assignmentType',
						type: 'options',
						options: [
							{ name: 'PC', value: 'PC' },
							{ name: 'Periphery', value: 'PERIPHERY' },
						],
						default: 'PERIPHERY',
					},
					{
						displayName: 'Service IDs',
						name: 'services',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [{ displayName: 'Service ID', name: 'serviceId', type: 'number', default: 0 }],
					},
				],
			},
			{ displayName: 'Location', name: 'location', type: 'string', default: '' },
			{ displayName: 'Manufacturer ID', name: 'manufacturerId', type: 'number', default: 0 },
			{
				displayName: 'Manufacturer Number',
				name: 'manufacturerNumber',
				type: 'string',
				default: '',
			},
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{
				displayName: 'Ownage Type',
				name: 'ownageType',
				type: 'options',
				options: [
					{ name: 'OWN', value: 'OWN' },
					{ name: 'FOREIGN', value: 'FOREIGN' },
					{ name: 'OWN_RENT', value: 'OWN_RENT' },
					{ name: 'FOREIGN_RENT', value: 'FOREIGN_RENT' },
				],
				default: 'OWN',
			},
			{ displayName: 'PC ID', name: 'pcId', type: 'number', default: 0 },
			{ displayName: 'Periphery Type ID', name: 'peripheryTypeId', type: 'number', default: 0 },
			{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number', default: 0 },
			{ displayName: 'Remark', name: 'remark', type: 'string', default: '' },
			{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number', default: 0 },
			{ displayName: 'Serial Number', name: 'serialNumber', type: 'string', default: '' },
			{ displayName: 'Storage ID', name: 'storageId', type: 'number', default: 0 },
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
			{ displayName: 'Version', name: 'version', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Get Periphery List Filters',
		name: 'peripheryListFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['list'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'number',
				default: 0,
				description: 'Filter peripheries by company ID',
			},
			{
				displayName: 'Branches',
				name: 'branches',
				type: 'options',
				options: [
					{ name: 'Company Only', value: 'COMPANY_ONLY' },
					{ name: 'Branches Only', value: 'BRANCHES_ONLY' },
					{ name: 'Company and Branches', value: 'COMPANY_AND_BRANCHES' },
					{ name: 'Specific Branch', value: 'SPECIFIC_BRANCH' },
				],
				default: 'COMPANY_ONLY',
				description: 'Filter peripheries by branch settings',
			},
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
				description: 'Filter peripheries by active state',
			},
			{
				displayName: 'Periphery Type ID',
				name: 'peripheryTypeId',
				type: 'number',
				default: 0,
				description: 'Filter peripheries by periphery type ID',
			},
		],
	},
	{
		displayName: 'Periphery Type ID',
		name: 'peripheryTypeId',
		type: 'number',
		required: true,
		default: 0,
		description: 'ID of the periphery type',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['deleteType', 'createType', 'updateType'],
			},
		},
	},
	{
		displayName: 'Create/Update Periphery Type Fields',
		name: 'peripheryTypeFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['createType', 'updateType'],
			},
		},
		default: {},
		options: [
			{ displayName: 'Image', name: 'image', type: 'string', default: '' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Assignment Fields',
		name: 'assignmentFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['periphery'],
				operation: ['assign', 'deleteAssignment'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Link ID',
				name: 'linkId',
				type: 'number',
				default: 0,
				description: 'Link ID of the "target" assignment (i.e. ID of the pc).',
			},
			{
				displayName: 'Link Type ID',
				name: 'linkTypeId',
				type: 'number',
				default: 0,
				description: 'Link type of the "target" assignment (i.e. 1 = pc).',
			},
		],
	},
];

function createPeripheriesCreateUpdateBaseFields(options?: {
	allowSubObjectId?: boolean;
	allFieldOptional?: boolean;
}): CrudFieldMap {
	const subObjectIdGuard = options?.allowSubObjectId
		? positiveNumberGuard
		: ApiQuirks.requiresIdOnCreate
			? positiveNumberGuard
			: discardGuard;

	return {
		peripheryFields: {
			location: 'body',
			spread: true,
			guard: createSubObjectGuard({
				companyId: {
					guard: options?.allFieldOptional ? nullOrGuard(positiveNumberGuard) : positiveNumberGuard,
				},
				peripheryTypeId: {
					guard: options?.allFieldOptional ? nullOrGuard(positiveNumberGuard) : positiveNumberGuard,
				},
				date: {
					guard: options?.allFieldOptional ? nullOrGuard(positiveNumberGuard) : positiveNumberGuard,
				},
				manufacturerId: {
					guard: nullOrGuard(positiveNumberGuard),
				},
				type: {
					guard: nullOrGuard(stringGuard),
				},
				location: {
					guard: nullOrGuard(stringGuard),
				},
				remark: {
					guard: nullOrGuard(stringGuard),
				},
				internalRemark: {
					guard: nullOrGuard(stringGuard),
				},
				serialNumber: {
					guard: nullOrGuard(stringGuard),
				},
				inventoryNumber: {
					guard: nullOrGuard(stringGuard),
				},
				version: {
					guard: nullOrGuard(stringGuard),
				},
				active: {
					guard: options?.allFieldOptional ? nullOrGuard(booleanGuard) : booleanGuard,
				},
				employeeId: {
					guard: nullOrGuard(positiveNumberGuard),
				},
				pcId: {
					guard: nullOrGuard(positiveNumberGuard),
				},
				billingNumber: {
					guard: nullOrGuard(stringGuard),
				},
				articleNumber: {
					guard: nullOrGuard(stringGuard),
				},
				storageId: {
					guard: nullOrGuard(positiveNumberGuard),
				},
				purchasePrice: {
					guard: nullOrGuard(numberGuard),
				},
				sellingPrice: {
					guard: nullOrGuard(numberGuard),
				},
				ownageType: {
					guard: nullOrGuard(stringGuard),
				},
				name: {
					guard: nullOrGuard(stringGuard),
				},
				description: {
					guard: nullOrGuard(stringGuard),
				},
				manufacturerNumber: {
					guard: nullOrGuard(stringGuard),
				},
				additionalFields: {
					locationName: 'fields',
					guard: nullOrGuard(
						arrayGuard(
							createSubObjectGuard({
								additionalFieldId: {
									guard: subObjectIdGuard,
								},
								title: { guard: stringGuard },
								value: { guard: stringGuard },
							}),
						),
					),
				},
				ipAddresses: {
					locationName: 'ips',
					guard: nullOrGuard(
						arrayGuard(
							createSubObjectGuard({
								id: {
									guard: subObjectIdGuard,
								},
								ip: { guard: nullOrGuard(stringGuard) },
								mac: { guard: nullOrGuard(stringGuard) },
								remark: { guard: nullOrGuard(stringGuard) },
								dhcp: { guard: booleanGuard },
								assignmentId: { guard: nullOrGuard(positiveNumberGuard) },
								assignmentType: { guard: nullOrGuard(stringGuard) },
								services: {
									guard: nullOrGuard(
										arrayGuard(
											createSubObjectGuard({
												serviceId: { guard: positiveNumberGuard },
											}),
										),
									),
								},
							}),
						),
					),
				},
				guaranteeInfo: {
					locationName: 'guarantee',
					guard: nullOrGuard(
						createSubObjectGuard({
							guaranteeExpire: { guard: nullOrGuard(positiveNumberGuard) },
							guaranteeMonth: { guard: nullOrGuard(positiveNumberGuard) },
							linkId: { guard: nullOrGuard(positiveNumberGuard) },
							linkTypeId: { guard: nullOrGuard(positiveNumberGuard) },
							purchaseDate: { guard: nullOrGuard(positiveNumberGuard) },
							remark: { guard: nullOrGuard(stringGuard) },
							warrantyExpire: { guard: nullOrGuard(positiveNumberGuard) },
							warrantyMonth: { guard: nullOrGuard(positiveNumberGuard) },
						}),
					),
				},
			}),
		},
	} satisfies CrudFieldMap;
}

function createPeripheriesTypesCreateUpdateBaseFields(options: {
	allowPeripheryTypeId: boolean;
	allFieldOptional?: boolean;
}): CrudFieldMap {
	const peripheryTypeIdGuard = options.allowPeripheryTypeId
		? ApiQuirks.requiresIdOnCreate
			? positiveNumberGuard
			: discardGuard
		: discardGuard;

	return {
		peripheryTypeFields: {
			location: 'body',
			spread: true,
			guard: createSubObjectGuard({
				peripheryTypeId: {
					guard: peripheryTypeIdGuard,
				},
				name: {
					guard: options.allFieldOptional ? nullOrGuard(stringGuard) : stringGuard,
				},
				image: {
					guard: nullOrGuard(stringGuard),
				},
			}),
		},
	} satisfies CrudFieldMap;
}

export const handlePeriphery = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		get: {
			fields: {
				peripheryId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'peripheries/{peripheryId}',
		},

		del: {
			fields: {
				peripheryId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'peripheries/{peripheryId}',
		},

		post: {
			fields: {
				peripheryId: {
					location: 'path',
					guard: ApiQuirks.requiresIdOnCreate ? positiveNumberGuard : discardGuard,
				},
				...createPeripheriesCreateUpdateBaseFields(),
			},
			httpMethod: 'POST',
			subPath: 'peripheries',
		},

		put: {
			fields: {
				peripheryId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				...createPeripheriesCreateUpdateBaseFields({
					allowSubObjectId: true,
					allFieldOptional: true,
				}),
			},
			httpMethod: 'PUT',
			subPath: 'peripheries/{peripheryId}',
		},

		list: {
			fields: {
				peripheryListFilters: {
					location: 'body',
					spread: true,
					guard: createSubObjectGuard({
						companyId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
						branches: {
							guard: nullOrGuard(stringGuard),
						},
						active: {
							guard: nullOrGuard(stringGuard),
						},
						peripheryTypeId: {
							guard: nullOrGuard(positiveNumberGuard),
						},
					}),
				},
			},
			httpMethod: 'PUT',
			subPath: 'peripheries',
		},

		getTypes: {
			fields: {},
			httpMethod: 'GET',
			subPath: 'peripheries/types',
		},

		createType: {
			fields: {
				peripheryTypeId: {
					location: 'body',
					guard: ApiQuirks.requiresIdOnCreate ? positiveNumberGuard : discardGuard,
				},
				...createPeripheriesTypesCreateUpdateBaseFields({ allowPeripheryTypeId: true }),
			},
			httpMethod: 'POST',
			subPath: 'peripheries/types',
		},

		updateType: {
			fields: {
				peripheryTypeId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				...createPeripheriesTypesCreateUpdateBaseFields({
					allowPeripheryTypeId: false,
					allFieldOptional: true,
				}),
			},
			httpMethod: 'PUT',
			subPath: 'peripheries/types/{peripheryTypeId}',
		},

		deleteType: {
			fields: {
				peripheryTypeId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'peripheries/types/{peripheryTypeId}',
		},

		assign: {
			fields: {
				peripheryId: {
					locationName: 'peripheryId',
					location: 'path',
					guard: positiveNumberGuard,
				},
				assignmentFields: {
					location: 'path',
					spread: true,
					guard: createSubObjectGuard({
						linkTypeId: {
							guard: positiveNumberGuard,
						},
						linkId: {
							guard: positiveNumberGuard,
						},
					}),
				},
			},
			httpMethod: 'POST',
			subPath: 'peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}',
		},

		deleteAssignment: {
			fields: {
				peripheryId: {
					locationName: 'peripheryId',
					location: 'path',
					guard: positiveNumberGuard,
				},
				assignmentFields: {
					location: 'path',
					spread: true,
					guard: createSubObjectGuard({
						linkTypeId: {
							guard: positiveNumberGuard,
						},
						linkId: {
							guard: positiveNumberGuard,
						},
					}),
				},
			},
			httpMethod: 'DELETE',
			subPath: 'peripheries/{peripheryId}/buildIn/{linkTypeId}/{linkId}',
		},
	},
});
