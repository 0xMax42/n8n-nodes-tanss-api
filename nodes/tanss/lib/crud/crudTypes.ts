import { IExecuteFunctions } from 'n8n-workflow';
import { NodeParameterValidator } from '../utils';

/**
 * High-level CRUD operation identifiers used by the node.
 */
export type CrudOperationType = 'create' | 'read' | 'update' | 'delete';

/**
 * HTTP methods used by the node.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Compile-time mapping from CRUD operation to HTTP method.
 * Keeps `type` and `httpMethod` consistent without runtime logic.
 */
export type CrudHttpMethod<T extends CrudOperationType> = T extends 'create'
	? 'POST'
	: T extends 'read'
		? 'GET'
		: T extends 'update'
			? 'PUT'
			: T extends 'delete'
				? 'DELETE'
				: never;

/**
 * Where a field is placed in the request building process.
 *
 * Path: Use `{name}` or `{locationName}` in the `subPath` to insert path parameters.
 */
export type CrudFieldLocation = 'query' | 'path' | 'body';

/**
 * A single parameter/field definition used to build or validate requests.
 */
export type CrudField<T = unknown> = {
	name: string;
	locationName?: string;
	location: CrudFieldLocation;
	defaultValue: T;
	validator: NodeParameterValidator<T>;
};

/**
 * Helper to define a CRUD field with proper typing.
 * @param field The field definition
 * @returns The same field definition with proper typing
 */
export function crudField<T>(field: CrudField<T>): CrudField<T> {
	return field;
}

/**
 * A single CRUD operation definition.
 *
 * Note: `type` drives `httpMethod` via `CrudHttpMethod<T>`.
 */
export interface CrudOperation<T extends CrudOperationType = CrudOperationType> {
	type: T;
	operationName: string;

	fields: CrudField[];

	httpMethod: CrudHttpMethod<T>;
	basePath?: string;
	subPath: string;
}

/**
 * Helper to define a CRUD operation with proper typing.
 * @param operation The operation definition
 * @returns The same operation definition with proper typing
 */
export function crudOperation<T extends CrudOperationType>(
	operation: CrudOperation<T>,
): CrudOperation<T> {
	return operation;
}

/**
 * Full CRUD configuration for a node/resource.
 */
export interface CrudOperationsConfig {
	operationField: Omit<CrudField<string>, 'location' | 'defaultValue' | 'validator'>;
	operations: CrudOperation[];
	credentialType?: 'system' | 'user';
}

export type NodeHandler = (this: IExecuteFunctions, i: number) => Promise<unknown>;
