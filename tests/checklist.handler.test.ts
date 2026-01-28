import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleChecklist } from '../nodes/tanss/sub/checklist';

const fixturesDir = path.join(__dirname, 'fixtures', 'checklist');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Checklist handler fixtures', handleChecklist, fixtures);
