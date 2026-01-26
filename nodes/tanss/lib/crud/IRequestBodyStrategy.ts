import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { CreateRecordFromFields, CrudOperation } from './crudTypes';

/**
 * Strategy interface for building request bodies for CRUD operations.
 */
export interface IRequestBodyStrategy {
	build(
		ctx: IExecuteFunctions,
		itemIndex: number,
		config: CrudOperation,
		createRecordFromFields: CreateRecordFromFields,
	): Promise<{
		body?: Record<string, unknown> | unknown[] | Buffer | undefined;
		headers?: Record<string, string>;
		json?: boolean;
	}>;
}

/**
 * Default JSON body strategy implementation.
 * Constructs a JSON body from the 'body' fields of the CRUD operation.
 */
export const JsonBodyStrategy: IRequestBodyStrategy = {
	async build(ctx, i, config, createRecordFromFields) {
		const body = createRecordFromFields.call(ctx, config.fields, i, 'body');

		if (!body) return {};

		return {
			body,
			headers: { 'Content-Type': 'application/json' },
			json: true,
		};
	},
};

export const TicketContentMultipartBodyStrategy: IRequestBodyStrategy = {
	async build(ctx, i, config, createRecordFromFields) {
		const body = createRecordFromFields.call(ctx, config.fields, i, 'body');

		if (
			!body ||
			typeof body !== 'object' ||
			!('binaryPropertyName' in body) ||
			typeof body.binaryPropertyName !== 'string' ||
			!('descriptions' in body) ||
			typeof body.descriptions !== 'string' ||
			!('internal' in body) ||
			typeof body.internal !== 'boolean'
		) {
			throw new NodeOperationError(ctx.getNode(), 'Invalid body for multipart/form-data');
		}

		const item = ctx.getInputData()[i];
		const binary = item.binary?.[body.binaryPropertyName as string];

		if (!binary?.data) {
			throw new NodeOperationError(ctx.getNode(), 'Binary data missing');
		}

		const fileBuffer = Buffer.from(binary.data, 'base64');
		const boundary = `----n8nBoundary${Date.now()}`;

		const parts: Buffer[] = [];

		// File part
		parts.push(
			Buffer.from(
				`--${boundary}\r\n` +
					`Content-Disposition: form-data; name="files"; filename="${binary.fileName ?? 'file'}"\r\n` +
					`Content-Type: ${binary.mimeType ?? 'application/octet-stream'}\r\n\r\n`,
			),
		);
		parts.push(fileBuffer);

		// Description
		parts.push(
			Buffer.from(
				`\r\n--${boundary}\r\n` +
					`Content-Disposition: form-data; name="descriptions"\r\n\r\n${body.descriptions}`,
			),
		);

		// Internal flag
		if (body.internal) {
			parts.push(
				Buffer.from(
					`\r\n--${boundary}\r\n` + `Content-Disposition: form-data; name="internal"\r\n\r\ntrue`,
				),
			);
		}

		// Close boundary
		parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));

		const bodyBuffer = Buffer.concat(parts);

		return {
			body: bodyBuffer,
			json: false,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${boundary}`,
				'Content-Length': String(bodyBuffer.length),
			},
		};
	},
};
