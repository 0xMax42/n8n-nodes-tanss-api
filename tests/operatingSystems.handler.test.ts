import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleOperatingSystems } from '../nodes/tanss/sub/OperatingSystems';

const fixturesDir = path.join(__dirname, 'fixtures', 'operatingSystems');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('OperatingSystems handler fixtures', handleOperatingSystems, fixtures);
