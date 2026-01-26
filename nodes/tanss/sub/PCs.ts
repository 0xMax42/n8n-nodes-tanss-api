import { INodeProperties } from 'n8n-workflow';
import {
	createCrudHandler,
	nonEmptyRecordGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const pcOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['pc'],
			},
		},
		options: [
			{
				name: 'Create PC',
				value: 'createPc',
				description: 'Creates a new PC or server',
				action: 'Creates a PC',
			},
			{
				name: 'Delete PC',
				value: 'deletePc',
				description: 'Deletes a PC or server',
				action: 'Deletes a PC',
			},
			{
				name: 'Get PC by ID',
				value: 'getPcById',
				description: 'Fetches a PC or server by a given ID',
				action: 'Fetches a PC by ID',
			},
			{
				name: 'List PCs',
				value: 'listPcs',
				description: 'Gets a list of PCs or servers',
				action: 'List pcs',
			},
			{
				name: 'Update PC',
				value: 'updatePc',
				description: 'Updates a PC or server',
				action: 'Updates a PC',
			},
		],
		default: 'getPcById',
	},
];

export const pcFields: INodeProperties[] = [
	{
		displayName: 'PC ID',
		name: 'pcId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['getPcById', 'updatePc', 'deletePc'],
			},
		},
		default: 0,
		description: 'ID of the PC or server',
	},
	{
		displayName: 'Company ID',
		name: 'companyId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc', 'updatePc'],
			},
		},
		default: 0,
		description: 'ID der Firma',
	},
	{
		displayName: 'Model',
		name: 'model',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['createPc', 'updatePc'],
			},
		},
		default: '',
		description: 'Modell des PCs oder Servers',
	},
	{
		displayName: 'PC Data',
		name: 'pcData',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['updatePc', 'createPc'],
			},
		},
		default: {},
		placeholder: 'Add Field',
		options: [
			{ displayName: 'Active', name: 'active', type: 'boolean', default: false },
			{ displayName: 'AnyDesk ID', name: 'anydeskId', type: 'string', default: '' },
			{
				displayName: 'AnyDesk Password',
				name: 'anydeskPassword',
				type: 'string',
				default: '',
				typeOptions: { password: true },
			},
			{
				displayName: 'Article Number',
				name: 'articleNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Billing Number',
				name: 'billingNumber',
				type: 'string',
				default: '',
			},
			{ displayName: 'BIOS', name: 'bios', type: 'string', default: '' },
			{ displayName: 'BIOS Release', name: 'biosRelease', type: 'string', default: '' },
			{ displayName: 'CPU Frequency', name: 'cpuFrequency', type: 'number', default: 0 },
			{
				displayName: 'CPU Manufacturer ID',
				name: 'cpuManufacturerId',
				type: 'number',
				default: 0,
			},
			{ displayName: 'CPU Number', name: 'cpuNumber', type: 'number', default: 0 },
			{ displayName: 'CPU Type ID', name: 'cpuTypeId', type: 'number', default: 0 },
			{ displayName: 'Date', name: 'date', type: 'number', default: 0 },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Employee ID', name: 'employeeId', type: 'number', default: 0 },
			{ displayName: 'Host ID', name: 'hostId', type: 'number', default: 0 },
			{
				displayName: 'Internal Remark',
				name: 'internalRemark',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Inventory Number',
				name: 'inventoryNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Keyboard Serial Number',
				name: 'keyboardSerialNumber',
				type: 'string',
				default: '',
			},
			{ displayName: 'Location', name: 'location', type: 'string', default: '' },
			{
				displayName: 'Mainboard Manufacturer ID',
				name: 'mainboardManufacturerId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Mainboard Manufacturer Revision',
				name: 'mainboardManufacturerRevision',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mainboard Serial Number',
				name: 'mainboardSerialNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Manufacturer ID',
				name: 'manufacturerId',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Manufacturer Number',
				name: 'manufacturerNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Mouse Serial Number',
				name: 'mouseSerialNumber',
				type: 'string',
				default: '',
			},
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'OS ID', name: 'osId', type: 'number', default: 0 },
			{
				displayName: 'Ownage Type',
				name: 'ownageType',
				type: 'options',
				options: [
					{ name: 'Foreign', value: 'FOREIGN' },
					{ name: 'Foreign Rent', value: 'FOREIGN_RENT' },
					{ name: 'Own', value: 'OWN' },
					{ name: 'Own Rent', value: 'OWN_RENT' },
				],
				default: 'OWN',
			},
			{ displayName: 'Purchase Price', name: 'purchasePrice', type: 'number', default: 0 },
			{ displayName: 'Remark', name: 'remark', type: 'string', default: '' },
			{ displayName: 'Reserved CPU', name: 'reservedCpu', type: 'number', default: 0 },
			{
				displayName: 'Reserved Hard Disk',
				name: 'reservedHardDisk',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Reserved RAM', name: 'reservedRam', type: 'number', default: 0 },
			{ displayName: 'Selling Price', name: 'sellingPrice', type: 'number', default: 0 },
			{ displayName: 'Serial Number', name: 'serialNumber', type: 'string', default: '' },
			{ displayName: 'Server', name: 'server', type: 'boolean', default: false },
			{
				displayName: 'Service Technician ID',
				name: 'serviceTechnicianId',
				type: 'number',
				default: 0,
			},
			{ displayName: 'Show Remark', name: 'showRemark', type: 'boolean', default: false },
			{ displayName: 'Software', name: 'software', type: 'string', default: '' },
			{ displayName: 'Storage ID', name: 'storageId', type: 'number', default: 0 },
			{ displayName: 'TeamViewer ID', name: 'teamviewerId', type: 'string', default: '' },
			{
				displayName: 'TeamViewer Password',
				name: 'teamviewerPassword',
				type: 'string',
				default: '',
				typeOptions: { password: true },
			},
		],
	},
	{
		displayName: 'List Query',
		name: 'listQuery',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['pc'],
				operation: ['listPcs'],
			},
		},
		default: {},
		placeholder: 'Add Field',
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
			},
			{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 },
			{
				displayName: 'OS IDs',
				name: 'osIds',
				type: 'multiOptions',
				typeOptions: { multipleValues: true },
				options: [],
				default: [],
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'PCs Only', value: 'PCS_ONLY' },
					{ name: 'Servers Only', value: 'SERVERS_ONLY' },
					{ name: 'Servers and PCs', value: 'SERVERS_AND_PCS' },
				],
				default: 'PCS_ONLY',
			},
		],
	},
];

export const handlePc = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getPcById: {
			fields: {
				pcId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'pcs/{pcId}',
		},

		updatePc: {
			fields: {
				pcId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				companyId: {
					location: 'body',
					guard: nullOrGuard(positiveNumberGuard),
				},
				model: {
					location: 'body',
					guard: nullOrGuard(stringGuard),
				},
				pcData: {
					location: 'body',
					spread: true,
					guard: nullOrGuard(nonEmptyRecordGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'pcs/{pcId}',
		},

		createPc: {
			fields: {
				companyId: {
					location: 'body',
					guard: positiveNumberGuard,
				},
				model: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
				pcData: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: nonEmptyRecordGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'pcs',
		},

		deletePc: {
			fields: {
				pcId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'DELETE',
			subPath: 'pcs/{pcId}',
		},

		listPcs: {
			fields: {
				listQuery: {
					location: 'body',
					spread: true,
					guard: nullOrGuard(nonEmptyRecordGuard),
				},
			},
			httpMethod: 'PUT',
			subPath: 'pcs',
		},
	},
});
