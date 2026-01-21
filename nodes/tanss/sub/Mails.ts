import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
	IHttpRequestOptions,
} from 'n8n-workflow';
import {
	addAuthorizationHeader,
	obtainToken,
	addQueryParams,
	generateAPIEndpointURL,
	getNodeParameter,
	nonEmptyRecordGuard,
	nonEmptyStringGuard,
	httpRequest,
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

export async function handleMails(this: IExecuteFunctions, i: number) {
	const operation = getNodeParameter(this, 'operation', i, '', nonEmptyStringGuard);
	const apiToken = await obtainToken(this, await this.getCredentials('tanssApi'), 'system');
	const receiver = getNodeParameter(this, 'receiver', i, '', nonEmptyStringGuard);

	let reqBody: Record<string, unknown> | undefined;
	switch (operation) {
		case 'testSmtp': {
			reqBody = getNodeParameter(this, 'mailObject', i, {}, nonEmptyRecordGuard);
			break;
		}

		default:
			throw new NodeOperationError(
				this.getNode(),
				`The operation "${operation}" is not recognized.`,
			);
	}

	if (!reqBody) {
		throw new NodeOperationError(
			this.getNode(),
			`The operation "${operation}" is missing required data.`,
		);
	}

	const url = generateAPIEndpointURL(
		this,
		(await this.getCredentials('tanssApi'))?.baseURL,
		'mails/test/smtp',
	);
	const requestOptions: IHttpRequestOptions = {
		method: 'POST',
		headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
		json: true,
		url,
		body: reqBody,
	};
	addAuthorizationHeader(requestOptions, apiToken);
	addQueryParams(requestOptions, { receiver: receiver });

	const response = await httpRequest(this, requestOptions);
	switch (response.kind) {
		case 'success':
			return {
				success: true,
				statusCode: response.statusCode,
				message: 'Test email sent',
				body: response.body,
			};
		case 'http-error':
			return {
				success: false,
				statusCode: response.statusCode,
				message: 'Server error while sending test email',
				body: response.body,
			};
		case 'network-error':
			throw new NodeOperationError(
				this.getNode(),
				`Network error while executing ${operation}: ${response.body}`,
			);
	}
}
