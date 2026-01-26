import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleCalls } from '../nodes/tanss/sub/calls';

const fixturesDir = path.join(__dirname, 'fixtures', 'calls');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Calls handler fixtures', handleCalls, fixtures);
