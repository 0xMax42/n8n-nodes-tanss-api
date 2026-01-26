import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleCpu } from '../nodes/tanss/sub/CPUs';

const fixturesDir = path.join(__dirname, 'fixtures', 'cpus');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('CPUs handler fixtures', handleCpu, fixtures);
