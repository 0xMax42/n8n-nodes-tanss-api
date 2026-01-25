import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import {
	InferSpec,
	NodeParameterGuard,
	SubGuardSpec,
	SubGuardSpecMap,
	SubObjectGuardConfig,
} from './guardTypes';
import { isArray, isPlainRecord } from './objectGuards';

export function createSubArrayGuard<T extends SubGuardSpecMap>(
	specs: T,
	config?: SubObjectGuardConfig,
): NodeParameterGuard<Array<InferSpec<T>>> {
	return (executeFunctions, value, name) => {
		if (!isPlainRecord(value)) {
			if (config?.allowEmpty === true) {
				return [] as Array<InferSpec<T>>;
			} else {
				throw new NodeOperationError(executeFunctions.getNode(), `${name} must be an object`);
			}
		}

		const input = value;

		if (config?.allowEmpty === true && Object.keys(input).length === 0) {
			return [] as Array<InferSpec<T>>;
		}

		const item: Record<string, unknown> = {};
		const items: Array<Record<string, unknown>> = [];

		for (const key of Object.keys(specs) as (keyof T)[]) {
			const spec = specs[key];
			const raw = input[key as string];
			const v = raw === undefined ? (spec.defaultValue ?? raw) : raw;

			const fieldName = `${name}.${String(key)}`;

			if (spec.spread) {
				handleSpread(executeFunctions, spec, v, fieldName, items, item);
				continue;
			}

			const locationName = spec.locationName ?? (key as string);
			const guardedValue = spec.guard(executeFunctions, v, fieldName);
			item[locationName] = item[locationName] ?? guardedValue;

			if (items.length > 0) {
				for (const existing of items) {
					if (existing[locationName] === undefined) {
						existing[locationName] = guardedValue;
					}
				}
			}
		}

		if (items.length === 0) {
			items.push(item);
		}
		return items as Array<InferSpec<T>>;
	};
}

function handleSpread(
	executeFunctions: IExecuteFunctions,
	spec: SubGuardSpec<unknown>,
	value: unknown,
	fieldName: string,
	out: Array<Record<string, unknown>>,
	base: Record<string, unknown>,
) {
	if (!isArray(value)) {
		throw new NodeOperationError(
			executeFunctions.getNode(),
			`${fieldName} is marked to be spread but its value is not an object.`,
		);
	}

	const validated = spec.guard(executeFunctions, value, fieldName) as Array<
		Record<string, unknown>
	>;

	for (const entry of validated) {
		out.push({ ...base, ...entry });
	}
}
