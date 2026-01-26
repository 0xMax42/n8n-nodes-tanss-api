import { IExecuteFunctions } from 'n8n-workflow';
import { CrudField } from '../crud';

/**
 * A Guard function type for validating and/or transforming node parameters.
 * @template T The expected type of the parameter value after validation
 * @param executeFunctions The execution functions context
 * @param value The value to validate
 * @param name The name of the parameter being validated
 * @returns The validated parameter value of type T
 * @throws The {@link NodeOperationError} exception can be thrown if validation fails.
 */
export type NodeParameterGuard<T> = (
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
) => T;

export type SubGuardSpec<T> = Omit<CrudField<T>, 'location'>;

export type SubGuardSpecMap = Record<string, SubGuardSpec<unknown>>;

export interface SubObjectGuardConfig {
	allowEmpty?: boolean;
}

export type InferSpec<T> = {
	[K in keyof T]: T[K] extends SubGuardSpec<infer V> ? V : never;
};
