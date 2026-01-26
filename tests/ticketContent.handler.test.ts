import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleTicketContent } from '../nodes/tanss/sub/TicketContent';

const fixturesDir = path.join(__dirname, 'fixtures', 'ticketContent');
const fixtures = loadFixturesFromDir(fixturesDir).map((fixture) => {
	if (fixture.injectThis && fixture.injectThis.getInputData === '__INJECT_INPUT_DATA__') {
		const items = [
			{
				json: {},
				binary: {
					data: {
						data: 'dGVzdA==',
						fileName: 'test.txt',
						mimeType: 'text/plain',
					},
				},
			},
		];
		return {
			...fixture,
			injectThis: {
				...fixture.injectThis,
				getInputData: () => items,
			},
		};
	}

	return fixture;
});

defineHandlerFixtureSuite('TicketContent handler fixtures', handleTicketContent, fixtures);
