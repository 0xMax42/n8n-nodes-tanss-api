import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { NodeParameterGuard } from './guardTypes';

/**
 * A Validator function that ensures a parameter is either null/undefined or passes the inner guard
 * @param innerGuard The guard function to apply if the value is not null/undefined
 * @returns A guard function that validates the value
 */
export function nullOrGuard<T>(
	innerGuard: NodeParameterGuard<T>,
): NodeParameterGuard<T | undefined> {
	return (executeFunctions: IExecuteFunctions, value: unknown, name: string): T | undefined => {
		if (value == null) {
			return undefined;
		}
		return innerGuard(executeFunctions, value, name);
	};
}

/**
 * A Validator function that ensures a parameter is of type boolean
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The value to validate
 * @param name The name of the parameter being validated
 * @returns The validated boolean value
 */
export function booleanGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): boolean {
	if (typeof value !== 'boolean') {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a boolean`);
	}
	return value;
}
