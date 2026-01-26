import { INodeProperties } from 'n8n-workflow';
import {
	nonEmptyStringGuard,
	createCrudHandler,
	booleanGuard,
	createSubObjectGuard,
	CrudFieldMap,
	nullOrGuard,
} from '../lib';

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

const mailObjectField = {
	mailObject: {
		location: 'body',
		spread: true,
		defaultValue: {},
		guard: createSubObjectGuard({
			smtpAddress: { guard: nonEmptyStringGuard },
			smtpHost: { guard: nonEmptyStringGuard },
			smtpUser: { guard: nonEmptyStringGuard },
			smtpPassword: { guard: nonEmptyStringGuard },
			smtpAuth: { guard: booleanGuard },
			smtpEncryptionType: { guard: nullOrGuard(nonEmptyStringGuard) },
			smtpSenderName: { guard: nullOrGuard(nonEmptyStringGuard) },
		}),
	},
} satisfies CrudFieldMap;

export const handleMails = createCrudHandler({
	operationField: 'operation',
	credentialType: 'user',

	operations: {
		testSmtp: {
			fields: {
				receiver: {
					location: 'query',
					defaultValue: '',
					guard: nonEmptyStringGuard,
				},
				...mailObjectField,
			},
			httpMethod: 'POST',
			subPath: 'mails/test/smtp',
		},
	},
});
