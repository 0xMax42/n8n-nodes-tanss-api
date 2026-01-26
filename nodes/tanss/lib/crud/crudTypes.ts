import { IExecuteFunctions } from 'n8n-workflow';
import { NodeParameterGuard } from '../guards';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JsonBodyStrategy, RequestBodyStrategy } from './RequestBodyStrategys';

/**
 * HTTP methods used by the node.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Where a field is placed in the request building process.
 *
 * Path: Use `{name}` or `{locationName}` in the `subPath` to insert path parameters.
 */
export type CrudFieldLocation = 'query' | 'path' | 'body';

/**
 * A single parameter/field definition used to build or validate requests.
 */

export type CrudField<T> = {
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
	 * The default value for the field; `undefined` will be propagated to the guard.
	 */
	defaultValue?: T;
	/**
	 * A guard function to validate and possibly transform the parameter value.
	 */
	guard: NodeParameterGuard<T>;
};

/**
 * A map of field names to their definitions.
 * Key is the field name used in the node parameters.
 * Value is the field definition.
 */
export type CrudFieldMap = Record<string, CrudField<unknown>>;

/**
 * A single CRUD operation definition.
 *
 * Note: `type` drives `httpMethod` via `CrudHttpMethod<T>`.
 */
export interface CrudOperation<T extends CrudFieldMap = CrudFieldMap> {
	/**
	 * The fields associated with the operation.
	 */
	fields: T;
	/**
	 * The HTTP method to use for the operation.
	 * @see {@link HttpMethod}
	 */
	httpMethod: HttpMethod;
	/**
	 * An optional base path to override the global one.
	 */
	basePath?: string;
	/**
	 * The sub-path for the operation, appended to the base path.
	 * @see {@link CrudFieldLocation} for path parameter usage.
	 */
	subPath: string;
	/**
	 * An optional strategy to build the request body for the operation.
	 * Defaults to {@link JsonBodyStrategy} if not provided.
	 */
	requestBodyStrategy?: RequestBodyStrategy;
}

/**
 * A map of operation names to their definitions.
 * Key is the operation name used in the node parameters.
 * Value is the operation definition.
 */
export type CrudOperationFieldMap = Record<string, CrudOperation>;

/**
 * Full CRUD configuration for a node/resource.
 */
export interface CrudOperationsConfig {
	/**
	 * The field that determines the operation to execute from the node parameters.
	 */
	operationField: string;
	/**
	 * The list of supported CRUD operations.
	 * You can have multiple operations of the same type as long as their `operationName` differs.
	 */
	operations: CrudOperationFieldMap;
	/**
	 * Optional credential type to use for the operations.
	 */
	credentialType?: 'system' | 'user';
}

export type NodeHandler = (this: IExecuteFunctions, i: number) => Promise<unknown>;

export type CreateRecordFromFields = (
	this: IExecuteFunctions,
	fields: CrudFieldMap,
	i: number,
	type: CrudFieldLocation,
) => Record<string, unknown> | unknown[] | undefined;
