import path from 'node:path';
import { defineHandlerFixtureSuite } from './handlerFixtures/fixtureRunner';
import { loadFixturesFromDir } from './handlerFixtures/loadFixtures';

import { handleRemoteSupports } from '../nodes/tanss/sub/RemoteSupports';

const fixturesDir = path.join(__dirname, 'fixtures', 'remoteSupports');
const fixtures = loadFixturesFromDir(fixturesDir);

defineHandlerFixtureSuite('RemoteSupports handler fixtures', handleRemoteSupports, fixtures);
