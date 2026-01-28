import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handlePeriphery } from '../nodes/tanss/sub/periphery';

const fixturesDir = path.join(__dirname, 'fixtures', 'periphery');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Periphery handler fixtures', handlePeriphery, fixtures);
