import http from 'http';
import app from './app';

import { storeRepository } from './store-repository';

const PORT = 3000;

/* eslint-disable no-console */
(async () => {
  try {
    await http.createServer(app).listen(PORT);
    await storeRepository.init();
    console.log(`Server listening on port ${PORT}.`);
  } catch (err) {
    console.error(`Error starting server: ${err}`);
  }
})();
