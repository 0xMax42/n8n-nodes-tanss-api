import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

/**
 * A Validator function that ensures a parameter is of type string
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The value to validate
 * @param name The name of the parameter being validated
 * @returns The validated string value
 * @throws The {@link NodeOperationError} exception is thrown if the value is not a string.
 */
export function stringGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): string {
	if (typeof value !== 'string') {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a string`);
	}
	return value.trim();
}

/**
 * A Validator function that ensures a string parameter is not empty or whitespace only
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The string value to validate
 * @param name The name of the parameter being validated
 * @returns The validated string value
 * @throws The {@link NodeOperationError} exception is thrown if the string is empty or whitespace only.
 */
export function nonEmptyStringGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): string {
	const str = stringGuard(executeFunctions, value, name);
	if (str.trim() === '') {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be empty`);
	}
	return str.trim();
}

export function csvGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): string[] {
	const str = stringGuard(executeFunctions, value, name);
	return str
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s !== '');
}
