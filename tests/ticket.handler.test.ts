import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleTicket } from '../nodes/tanss/sub/Tickets';

const fixturesDir = path.join(__dirname, 'fixtures', 'ticket');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Ticket handler fixtures', handleTicket, fixtures);
