/* tests/mails.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handleMails } from '../nodes/tanss/sub/Mails';

const fixturesDir = path.join(__dirname, 'fixtures', 'mails');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Mails handler fixtures', handleMails, fixtures);
