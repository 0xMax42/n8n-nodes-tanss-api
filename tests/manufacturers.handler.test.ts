/* tests/manufacturers.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handleManufacturers } from '../nodes/tanss/sub/manufacturers';

const fixturesDir = path.join(__dirname, 'fixtures', 'manufacturers');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Manufacturers handler fixtures', handleManufacturers, fixtures);
