import http from 'http';
import app from './app';

const PORT = 3000;

/* eslint-disable no-console */
(async () => {
  try {
    await http.createServer(app).listen(PORT);
    console.log(`Server listening on port ${PORT}.`);
  } catch (err) {
    console.error(`Error starting server: ${err}`);
  }
})();
