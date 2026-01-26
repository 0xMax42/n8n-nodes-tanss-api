import { IExecuteFunctions } from 'n8n-workflow';
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
		body?: Record<string, unknown> | unknown[] | undefined;
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
