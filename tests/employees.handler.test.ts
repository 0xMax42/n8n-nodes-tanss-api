import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleEmployees } from '../nodes/tanss/sub/Employees';

const fixturesDir = path.join(__dirname, 'fixtures', 'employees');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Employees handler fixtures', handleEmployees, fixtures);
