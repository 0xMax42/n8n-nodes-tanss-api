import { CrudFieldMap } from './crudTypes';

/**
 * Creates a CRUD field map by replacing a specified key with a new key.
 * This is useful for adapting field maps to different naming conventions.
 * @param fieldKey The Key mapping containing fromKey and toKey
 * @param fieldMap The original CRUD field map
 * @returns A new CRUD field map with the specified key replaced
 * @throws Error if the fieldMap is empty or does not contain the fromKey
 */
export function createCrudFieldMap<T extends CrudFieldMap>(
	fieldKey: { fromKey: keyof T; toKey: string },
	fieldMap: CrudFieldMap,
): CrudFieldMap {
	if (!fieldMap || Object.keys(fieldMap).length === 0 || !(fieldKey.fromKey in fieldMap)) {
		throw new Error('fieldMap must be a non-empty object and contain the fromKey.');
	}
	// Replace the key in the fieldMap and keep his content
	const newFieldMap: CrudFieldMap = {};
	for (const [key, value] of Object.entries(fieldMap)) {
		if (key === fieldKey.fromKey) {
			newFieldMap[fieldKey.toKey] = value;
		} else {
			newFieldMap[key] = value;
		}
	}
	return newFieldMap;
}
