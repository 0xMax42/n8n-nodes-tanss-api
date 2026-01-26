import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleTimestamps } from '../nodes/tanss/sub/timestamp';

const fixturesDir = path.join(__dirname, 'fixtures', 'timestamps');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Timestamps handler fixtures', handleTimestamps, fixtures);
