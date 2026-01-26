import { INodeProperties } from 'n8n-workflow';
import {
	booleanGuard,
	createCrudHandler,
	nonEmptyStringGuard,
	positiveNumberGuard,
	TicketContentMultipartBodyStrategy,
} from '../lib';

export const ticketContentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
			},
		},
		options: [
			{
				name: 'Get Ticket Documents',
				value: 'getTicketDocuments',
				description: 'Gets all documents attached to a ticket (list)',
				action: 'Get ticket documents',
			},
			{
				name: 'Get Ticket Document',
				value: 'getTicketDocument',
				description: 'Generates a one-time download URL for a specific ticket document',
				action: 'Get a ticket document',
			},
			{
				name: 'Get Ticket Images',
				value: 'getTicketImages',
				description: 'Gets all images (screenshots) attached to a ticket (list)',
				action: 'Get ticket images',
			},
			{
				name: 'Get Ticket Image',
				value: 'getTicketImage',
				description: 'Generates a one-time download URL for a specific ticket image',
				action: 'Get a ticket image',
			},
			{
				name: 'Upload Document / Image',
				value: 'uploadTicketContent',
				description: 'Uploads a document or image into a ticket (multipart/form-data)',
				action: 'Upload document or image to ticket',
			},
		],
		default: 'getTicketDocuments',
	},
];

export const ticketContentFields: INodeProperties[] = [
	{
		displayName: 'API Token',
		name: 'apiToken',
		type: 'string' as const,
		required: true,
		typeOptions: { password: true },
		default: '',
		description: 'API token obtained from the TANSS API login',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
			},
		},
	},
	{
		displayName: 'Ticket ID',
		name: 'ticketId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
			},
		},
		default: 0,
		description: 'ID of the ticket',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['getTicketDocument'],
			},
		},
		default: 0,
		description: 'ID of the document to generate a one-time download URL for',
	},
	{
		displayName: 'Image ID',
		name: 'imageId',
		type: 'number' as const,
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['getTicketImage'],
			},
		},
		default: 0,
		description: 'ID of the image to generate a one-time download URL for',
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string' as const,
		default: 'data',
		description: 'Name of the binary property that contains the file to upload',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['uploadTicketContent'],
			},
		},
	},
	{
		displayName: 'Descriptions',
		name: 'descriptions',
		type: 'string' as const,
		default: '',
		description: 'Description for the uploaded file(s) (if multiple, separate by newline)',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['uploadTicketContent'],
			},
		},
	},
	{
		displayName: 'Internal',
		name: 'internal',
		type: 'boolean' as const,
		default: false,
		description: 'Mark the uploaded file(s) as internal',
		displayOptions: {
			show: {
				resource: ['ticketContent'],
				operation: ['uploadTicketContent'],
			},
		},
	},
];

export const handleTicketContent = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		getTicketDocuments: {
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'tickets/{ticketId}/documents',
		},

		getTicketDocument: {
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				documentId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'tickets/{ticketId}/documents/{documentId}',
		},

		getTicketImages: {
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'tickets/{ticketId}/screenshots',
		},

		getTicketImage: {
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				imageId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
			},
			httpMethod: 'GET',
			subPath: 'tickets/{ticketId}/screenshots/{imageId}',
		},

		uploadTicketContent: {
			fields: {
				ticketId: {
					location: 'path',
					guard: positiveNumberGuard,
				},
				binaryPropertyName: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
				descriptions: {
					location: 'body',
					guard: nonEmptyStringGuard,
				},
				internal: {
					location: 'body',
					guard: booleanGuard,
				},
			},
			httpMethod: 'POST',
			subPath: 'tickets/{ticketId}/upload',
			requestBodyStrategy: TicketContentMultipartBodyStrategy,
		},
	},
});
