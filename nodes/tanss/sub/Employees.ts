import { INodeProperties } from 'n8n-workflow';
import {
	arrayGuard,
	booleanGuard,
	createCrudHandler,
	createSubObjectGuard,
	nonEmptyStringGuard,
	nullOrGuard,
	positiveNumberGuard,
	stringGuard,
} from '../lib';

export const employeesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['employees'] } },
		options: [
			{
				name: 'Get Technicians',
				value: 'getTechnicians',
				description: 'Gets all technicians of this system',
				action: 'Get technicians',
			},
			{
				name: 'Create Employee',
				value: 'createEmployee',
				description: 'Creates a new employee',
				action: 'Create employee',
			},
		],
		default: 'getTechnicians',
	},
];

export const employeesFields: INodeProperties[] = [
	{
		displayName: 'Freelancer Company ID',
		name: 'freelancerCompanyId',
		type: 'number',
		default: 0,
		description: 'If set, also fetches freelancers of this company (0 for all freelancers)',
		displayOptions: { show: { resource: ['employees'], operation: ['getTechnicians'] } },
	},

	{
		displayName: 'Employee Object',
		name: 'employeeObject',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['employees'], operation: ['createEmployee'] } },
		default: {},
		options: [
			{ displayName: 'Accounting Type ID', name: 'accountingTypeId', type: 'number', default: 0 },
			{ displayName: 'Active', name: 'active', type: 'boolean', default: true },
			{
				displayName: 'Birthday (YYYY-MM-DD)',
				name: 'birthday',
				type: 'string',
				default: '',
			},
			{ displayName: 'Car ID', name: 'carId', type: 'number', default: 0 },
			{
				displayName: 'Company Assignments',
				name: 'companyAssignments',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Assignment',
						name: 'assignment',
						values: [{ displayName: 'Company ID', name: 'companyId', type: 'number', default: 0 }],
					},
				],
			},
			{ displayName: 'Department ID', name: 'departmentId', type: 'number', default: 0 },
			{ displayName: 'Email Address', name: 'emailAddress', type: 'string', default: '' },
			{ displayName: 'ERP Number', name: 'erpNumber', type: 'string', default: '' },
			{ displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
			{ displayName: 'ID', name: 'id', type: 'number', default: 0 },
			{ displayName: 'Initials', name: 'initials', type: 'string', default: '' },
			{ displayName: 'Language', name: 'language', type: 'string', default: '' },
			{ displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
			{ displayName: 'Mobile Number Two', name: 'mobileNumberTwo', type: 'string', default: '' },
			{ displayName: 'Mobile Phone', name: 'mobilePhone', type: 'string', default: '' },
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{
				displayName: 'Personal Fax Number',
				name: 'personalFaxNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Private Phone Number',
				name: 'privatePhoneNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Restricted User License',
				name: 'restrictedUserLicense',
				type: 'boolean',
				default: false,
			},
			{ displayName: 'Role', name: 'role', type: 'string', default: '' },
			{ displayName: 'Room', name: 'room', type: 'string', default: '' },
			{ displayName: 'Salutation ID', name: 'salutationId', type: 'number', default: 0 },
			{
				displayName: 'Telephone Number',
				name: 'telephoneNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Telephone Number Two',
				name: 'telephoneNumberTwo',
				type: 'string',
				default: '',
			},
			{ displayName: 'Title ID', name: 'titleId', type: 'number', default: 0 },
			{
				displayName: 'Working Hour Model ID',
				name: 'workingHourModelId',
				type: 'number',
				default: 0,
			},
		],
	},
];

export const handleEmployees = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getTechnicians: {
			httpMethod: 'GET',
			subPath: 'employees/technicians',
			fields: {
				freelancerCompanyId: {
					location: 'query',
					guard: positiveNumberGuard,
				},
			},
		},

		createEmployee: {
			httpMethod: 'POST',
			subPath: 'employees',
			fields: {
				employeeObject: {
					location: 'body',
					spread: true,
					defaultValue: {},
					guard: createSubObjectGuard({
						id: { guard: positiveNumberGuard },
						name: { guard: nonEmptyStringGuard },
						firstName: { guard: nullOrGuard(stringGuard) },
						lastName: { guard: nullOrGuard(stringGuard) },
						salutationId: { guard: nullOrGuard(positiveNumberGuard) },
						departmentId: { guard: nullOrGuard(positiveNumberGuard) },
						room: { guard: nullOrGuard(stringGuard) },
						telephoneNumber: { guard: nullOrGuard(stringGuard) },
						emailAddress: { guard: nullOrGuard(stringGuard) },
						carId: { guard: nullOrGuard(positiveNumberGuard) },
						mobilePhone: { guard: nullOrGuard(stringGuard) },
						initials: { guard: nullOrGuard(stringGuard) },
						workingHourModelId: { guard: nullOrGuard(positiveNumberGuard) },
						accountingTypeId: { guard: nullOrGuard(positiveNumberGuard) },
						privatePhoneNumber: { guard: nullOrGuard(stringGuard) },
						active: { guard: nullOrGuard(booleanGuard) },
						erpNumber: { guard: nullOrGuard(stringGuard) },
						personalFaxNumber: { guard: nullOrGuard(stringGuard) },
						role: { guard: nullOrGuard(stringGuard) },
						titleId: { guard: nullOrGuard(positiveNumberGuard) },
						language: { guard: nullOrGuard(stringGuard) },
						telephoneNumberTwo: { guard: nullOrGuard(stringGuard) },
						mobileNumberTwo: { guard: nullOrGuard(stringGuard) },
						restrictedUserLicense: { guard: nullOrGuard(booleanGuard) },
						birthday: { guard: nullOrGuard(stringGuard) },
						companyAssignments: {
							guard: createSubObjectGuard(
								{
									assignment: {
										spread: true,
										guard: arrayGuard(
											createSubObjectGuard({
												companyId: { guard: positiveNumberGuard },
											}),
										),
									},
								},
								{ allowEmpty: true },
							),
						},
					}),
				},
			},
		},
	},
});
