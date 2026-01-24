import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handlePc } from '../nodes/tanss/sub/PCs';

const fixturesDir = path.join(__dirname, 'fixtures', 'pc');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('PC handler fixtures', handlePc, fixtures);
