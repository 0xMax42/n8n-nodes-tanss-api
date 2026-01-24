import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

/**
 * A Validator function that ensures a parameter is of type number
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The value to validate
 * @param name The name of the parameter being validated
 * @returns The validated number value
 * @throws The {@link NodeOperationError} exception is thrown if the value is not a number.
 */
export function numberGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): number {
	if (typeof value !== 'number' || isNaN(value)) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a number`);
	}
	return value;
}

export function positiveNumberGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): number {
	const number = numberGuard(executeFunctions, value, name);
	if (number <= 0) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a positive number`);
	}
	return number;
}

export function nonNegativeNumberGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): number {
	const number = numberGuard(executeFunctions, value, name);
	if (number < 0) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`${name} must be a non-negative number`,
		);
	}
	return number;
}

/**
 * A Validator function that ensures a number parameter is not zero
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The number value to validate
 * @param name The name of the parameter being validated
 * @returns The validated number value
 * @throws The {@link NodeOperationError} exception is thrown if the number is zero.
 */
export function nonZeroNumberGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): number {
	const number = numberGuard(executeFunctions, value, name);
	if (number == 0) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be zero`);
	}
	return number;
}
