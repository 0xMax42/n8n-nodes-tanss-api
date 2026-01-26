import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleIps } from '../nodes/tanss/sub/ips';

const fixturesDir = path.join(__dirname, 'fixtures', 'ips');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('IPS handler fixtures', handleIps, fixtures);
