import path from 'node:path';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';

import { handleComponents } from '../nodes/tanss/sub/components';

const fixturesDir = path.join(__dirname, 'fixtures', 'components');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Components handler fixtures', handleComponents, fixtures);
