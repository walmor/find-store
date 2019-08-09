import express from 'express';
import bodyParser from 'body-parser';
import errorHandler from 'express-error-handler';
import 'express-async-errors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  res.json({ message: 'Hello World!' });
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
