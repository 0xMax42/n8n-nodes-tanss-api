import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { NodeParameterGuard } from './guardTypes';

export function nullOrGuard<T>(innerGuard: NodeParameterGuard<T>): NodeParameterGuard<T | null> {
	return (executeFunctions: IExecuteFunctions, value: unknown, name: string): T | null => {
		if (value == null) {
			return null;
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
