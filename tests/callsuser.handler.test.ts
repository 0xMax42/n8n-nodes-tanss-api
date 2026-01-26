/* tests/callsuser.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import the real handler here:
import { handleCallsUser } from '../nodes/tanss/sub/callsuser';

const fixturesDir = path.join(__dirname, 'fixtures', 'callsuser');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('CallsUser handler fixtures', handleCallsUser, fixtures);
