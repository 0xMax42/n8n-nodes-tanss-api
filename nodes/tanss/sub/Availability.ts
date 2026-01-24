import { INodeProperties } from 'n8n-workflow';
import { createCrudHandler, nonEmptyStringGuard } from '../lib';

export const availabilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['availability'] } },
		options: [
			{
				name: 'Get Availability',
				value: 'getAvailability',
				description: 'Fetch availability information for employees',
				action: 'Get availability',
			},
		],
		default: 'getAvailability',
	},
];

export const availabilityFields: INodeProperties[] = [
	{
		displayName: 'Employee IDs (Comma Separated)',
		name: 'employeeIds',
		type: 'string' as const,
		required: true,
		default: '',
		description: 'Comma-separated list of employee IDs to fetch availability for',
		displayOptions: { show: { resource: ['availability'], operation: ['getAvailability'] } },
	},
];

export const handleAvailability = createCrudHandler({
	operationField: 'operation',

	operations: {
		getAvailability: {
			fields: {
				employeeIds: {
					location: 'query',
					defaultValue: '',
					guard: nonEmptyStringGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'availability',
		},
	},
});
