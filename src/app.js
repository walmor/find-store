import express from 'express';
import bodyParser from 'body-parser';
import errorHandler from 'express-error-handler';
import 'express-async-errors';

import { storeService } from './store-service';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/closest', async (req, res) => {
  res.json(await storeService.closest(req.query));
});

app.use(
  errorHandler({
    serializer(err) {
      const body = {
        status: err.status,
        message: err.message,
      };

      return body;
    },
  }),
);

export default app;
