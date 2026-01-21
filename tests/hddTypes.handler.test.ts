/* tests/hddTypes.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handleHddTypes } from '../nodes/tanss/sub/hddTypes';

const fixturesDir = path.join(__dirname, 'fixtures', 'hddTypes');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('HDD Types handler fixtures', handleHddTypes, fixtures);
