import path from 'node:path';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';

import { handleCallback } from '../nodes/tanss/sub/callback';

const fixturesDir = path.join(__dirname, 'fixtures', 'callback');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Callback handler fixtures', handleCallback, fixtures);
