import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleTicketList } from '../nodes/tanss/sub/TicketLists';

const fixturesDir = path.join(__dirname, 'fixtures', 'ticketList');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('TicketList handler fixtures', handleTicketList, fixtures);
