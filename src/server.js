import http from 'http';
import app from './app';

import { config } from './config';
import { storeRepository } from './store-repository';

/* eslint-disable no-console */
(async () => {
  try {
    await http.createServer(app).listen(config.PORT);
    await storeRepository.init();
    console.log(`Server listening on port ${config.PORT}.`);
  } catch (err) {
    console.error(`Error starting server: ${err}`);
  }
})();
