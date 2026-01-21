import { INodeProperties } from 'n8n-workflow';
import { nonEmptyRecordGuard, nonEmptyStringGuard } from '../lib';
import { createCrudHandler } from '../lib/crud/crud';
import { crudField, crudOperation } from '../lib/crud';

export const mailsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options' as const,
		noDataExpression: true,
		displayOptions: { show: { resource: ['mails'] } },
		options: [
			{
				name: 'Test SMTP Settings',
				value: 'testSmtp',
				description: 'Send a test email using specified SMTP settings',
				action: 'Test SMTP',
			},
		],
		default: 'testSmtp',
	},
];

export const mailsFields: INodeProperties[] = [
	{
		displayName: 'Receiver',
		name: 'receiver',
		type: 'string' as const,
		required: true,
		default: '',
		description: 'Receiver of the test message',
		displayOptions: { show: { resource: ['mails'], operation: ['testSmtp'] } },
	},
	{
		displayName: 'Email Settings',
		name: 'mailObject',
		type: 'collection' as const,
		placeholder: 'Add Field',
		displayOptions: { show: { resource: ['mails'], operation: ['testSmtp'] } },
		default: {},
		options: [
			{ displayName: 'SMTP Address', name: 'smtpAddress', type: 'string' as const, default: '' },
			{ displayName: 'SMTP Host', name: 'smtpHost', type: 'string' as const, default: '' },
			{ displayName: 'SMTP User', name: 'smtpUser', type: 'string' as const, default: '' },
			{
				displayName: 'SMTP Password',
				name: 'smtpPassword',
				type: 'string' as const,
				default: '',
				typeOptions: { password: true },
			},
			{ displayName: 'SMTP Auth', name: 'smtpAuth', type: 'boolean' as const, default: false },
			{
				displayName: 'SMTP Encryption Type',
				name: 'smtpEncryptionType',
				type: 'options' as const,
				default: 'NONE',
				options: [
					{ name: 'NONE', value: 'NONE' },
					{ name: 'SSL', value: 'SSL' },
					{ name: 'TLS', value: 'TLS' },
				],
			},
			{
				displayName: 'SMTP Sender Name',
				name: 'smtpSenderName',
				type: 'string' as const,
				default: '',
			},
		],
	},
];

export const handleMails = createCrudHandler({
	operationField: {
		name: 'operation',
	},
	operations: [
		crudOperation({
			type: 'create',
			operationName: 'testSmtp',
			fields: [
				crudField({
					name: 'receiver',
					location: 'query',
					defaultValue: '',
					validator: nonEmptyStringGuard,
				}),
				crudField({
					name: 'mailObject',
					location: 'body',
					defaultValue: {},
					validator: nonEmptyRecordGuard,
				}),
			],
			httpMethod: 'POST',
			subPath: 'mails/test/smtp',
		}),
	],
});
