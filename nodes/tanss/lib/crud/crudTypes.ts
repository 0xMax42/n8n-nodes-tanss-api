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
	/**
	 * The name of the field as used in the node parameters.
	 */
	name: string;
	/**
	 * Optional different name to use in the request instead of `name`.
	 */
	locationName?: string;
	/**
	 * If true, the field's value (checked to be an object) will be spread into the parent object
	 */
	spread?: boolean;
	/**
	 * Where the field is located in the request.
	 */
	location: CrudFieldLocation;
	/**
	 * The default value for the field; `undefined` will be propagated to the validator.
	 */
	defaultValue: T | undefined;
	/**
	 * A validator function to validate and possibly transform the parameter value.
	 */
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
	/**
	 * The CRUD operation type.
	 * @see {@link CrudOperationType}
	 */
	type: T;
	/**
	 * The unique name of the operation used in the node parameters.
	 */
	operationName: string;
	/**
	 * The fields associated with the operation.
	 */
	fields: CrudField[];
	/**
	 * The HTTP method to use for the operation.
	 * @see {@link HttpMethod}
	 */
	httpMethod: CrudHttpMethod<T>;
	/**
	 * An optional base path to override the global one.
	 */
	basePath?: string;
	/**
	 * The sub-path for the operation, appended to the base path.
	 * @see {@link CrudFieldLocation} for path parameter usage.
	 */
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
	/**
	 * The field that determines the operation to execute from the node parameters.
	 */
	operationField: Omit<CrudField<string>, 'location' | 'defaultValue' | 'validator'>;
	/**
	 * The list of supported CRUD operations.
	 * You can have multiple operations of the same type as long as their `operationName` differs.
	 */
	operations: CrudOperation[];
	/**
	 * Optional credential type to use for the operations.
	 */
	credentialType?: 'system' | 'user';
}

export type NodeHandler = (this: IExecuteFunctions, i: number) => Promise<unknown>;
