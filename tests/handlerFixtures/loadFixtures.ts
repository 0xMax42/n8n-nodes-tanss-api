/* tests/handlerFixtures/loadFixtures.ts */
import fs from 'node:fs';
import path from 'node:path';
import { HandlerFixture } from './fixtureTypes';

/**
 * Load all *.json fixtures from a directory.
 * The JSON must match the HandlerFixture schema.
 */
export function loadFixturesFromDir(dir: string): HandlerFixture[] {
	const files = fs
		.readdirSync(dir)
		.filter((f) => f.toLowerCase().endsWith('.json'))
		.sort();

	return files.map((file) => {
		const full = path.join(dir, file);
		const raw = fs.readFileSync(full, 'utf8');
		const parsed = JSON.parse(raw) as HandlerFixture;

		// Helpful default: if fixture.name missing, use filename
		if (!parsed.name) parsed.name = file;

		return parsed;
	});
}
