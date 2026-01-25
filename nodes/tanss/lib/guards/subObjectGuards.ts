import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import {
	InferSpec,
	NodeParameterGuard,
	SubGuardSpec,
	SubGuardSpecMap,
	SubObjectGuardConfig,
} from './guardTypes';
import { isPlainRecord } from './objectGuards';

/**
 * Creates a sub-object guard based on the provided specifications.
 * @param specs A map of sub-guard specifications defining the structure and validation rules for the sub-object.
 * @param config A optional configuration object to customize the factory behavior.
 * @returns A NodeParameterGuard that validates and transforms sub-objects according to the provided specifications.
 * @example
 * ```ts
 * const addressGuard = createSubObjectGuard({
 *   street: {
 *     guard: nonEmptyStringGuard,
 *   },
 *   city: {
 *     guard: nonEmptyStringGuard,
 *   },
 *   zipCode: {
 *     guard: nonEmptyStringGuard,
 *   },
 * });
 */
export function createSubObjectGuard<T extends SubGuardSpecMap>(
	specs: T,
	config?: SubObjectGuardConfig,
): NodeParameterGuard<InferSpec<T>> {
	return (executeFunctions, value, name) => {
		if (!isPlainRecord(value)) {
			if (config?.allowEmpty === true) {
				return {} as InferSpec<T>;
			} else {
				throw new NodeOperationError(executeFunctions.getNode(), `${name} must be an object`);
			}
		}

		const input = value;

		if (config?.allowEmpty === true && Object.keys(input).length === 0) {
			return {} as InferSpec<T>;
		} else if (Object.keys(input).length === 0) {
			throw new NodeOperationError(executeFunctions.getNode(), `${name} cannot be empty`);
		}

		const out: Record<string, unknown> = {};

		for (const key of Object.keys(specs) as (keyof T)[]) {
			const spec = specs[key];
			const raw = input[key as string];
			const v = raw === undefined ? (spec.defaultValue ?? raw) : raw;

			const fieldName = `${name}.${String(key)}`;

			if (spec.spread) {
				handleSpread(executeFunctions, spec, v, fieldName, out);
				continue;
			}

			const locationName = spec.locationName ?? (key as string);
			out[locationName] = out[locationName] ?? spec.guard(executeFunctions, v, fieldName);
		}

		return out as InferSpec<T>;
	};
}

function handleSpread(
	executeFunctions: IExecuteFunctions,
	spec: SubGuardSpec<unknown>,
	value: unknown,
	fieldName: string,
	out: Record<string, unknown>,
) {
	if (!isPlainRecord(value)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`${fieldName} is marked to be spread but its value is not an object.`,
		);
	}

	const validated = spec.guard(executeFunctions, value, fieldName) as Record<string, unknown>;

	for (const [subKey, subValue] of Object.entries(validated)) {
		if (out[subKey] === undefined) {
			out[subKey] = subValue;
		}
	}
}
