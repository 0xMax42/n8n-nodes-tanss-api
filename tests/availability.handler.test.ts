/* tests/availability.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handleAvailability } from '../nodes/tanss/sub/Availability';

const fixturesDir = path.join(__dirname, 'fixtures', 'availability');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Availability handler fixtures', handleAvailability, fixtures);
