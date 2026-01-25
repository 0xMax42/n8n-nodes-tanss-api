import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { NodeParameterGuard } from './guardTypes';

/**
 * Type guard to check if a value is a plain object (Record<string, unknown>)
 * @param value The value to check
 * @returns True if the value is a plain object, false otherwise
 */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === Object.prototype || proto === null;
}

/**
 * Type guard to check if a value is an array
 * @param value The value to check
 * @returns True if the value is an array, false otherwise
 */
export function isArray(value: unknown): value is Array<unknown> {
	return Array.isArray(value);
}

export function arrayGuard<T>(innerGuard: NodeParameterGuard<T>): NodeParameterGuard<T[]> {
	return (executeFunctions: IExecuteFunctions, value: unknown, name: string): T[] => {
		if (!Array.isArray(value)) {
			throw new NodeOperationError(executeFunctions.getNode(), `${name} must be an array`);
		}
		return value.map((v) => innerGuard(executeFunctions, v, name));
	};
}

/**
 * A Validator function that ensures a record parameter is not empty
 * for use with {@link getNodeParameter}.
 * @param executeFunctions The execution functions context
 * @param value The record value to validate
 * @param name The name of the parameter being validated
 * @returns The validated record value
 * @throws The {@link NodeOperationError} exception is thrown if the record is empty.
 */
export function nonEmptyRecordGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): Record<string, unknown> {
	if (!isPlainRecord(value)) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a non-empty record`);
	}
	if (Object.keys(value).length === 0) {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be empty`);
	}
	return value;
}

/**
 * A Validator function that ensures a parameter is a valid JSON object
 * for use with {@link getNodeParameter}.
 * If the value is a non empty string, it attempts to parse it as JSON.
 * If the value is an empty string, it returns an empty object.
 * @param executeFunctions The execution functions context
 * @param value The value to validate
 * @param name The name of the parameter being validated
 * @returns The validated JSON object
 */
export function jsonGuard(
	executeFunctions: IExecuteFunctions,
	value: unknown,
	name: string,
): Record<string, unknown> {
	if (typeof value === 'string') {
		const str = value.trim();
		if (str == '') {
			return {};
		} else {
			try {
				const parsed = JSON.parse(str);
				if (typeof parsed !== 'object' || parsed === null) {
					throw new Error('Parsed value is not an object.');
				}
				return parsed as Record<string, unknown>;
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				throw new NodeOperationError(
					executeFunctions.getNode(),
					`${name} must be valid JSON: ${msg}`,
				);
			}
		}
	} else {
		throw new NodeOperationError(executeFunctions.getNode(), `${name} must be a JSON object`);
	}
}

export function jsonAndGuard<T>(
	innerGuard: NodeParameterGuard<T>,
): NodeParameterGuard<T | undefined> {
	return (executeFunctions: IExecuteFunctions, value: unknown, name: string): T | undefined => {
		const json = jsonGuard(executeFunctions, value, name);
		return innerGuard(executeFunctions, json, name);
	};
}
