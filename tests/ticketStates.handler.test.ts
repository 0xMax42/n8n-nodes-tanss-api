/* tests/ticketStates.handler.test.ts */
import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

// Import your real handler here:
import { handleTicketStates } from '../nodes/tanss/sub/TicketSates';

const fixturesDir = path.join(__dirname, 'fixtures', 'ticketStates');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('Ticket States handler fixtures', handleTicketStates, fixtures);
