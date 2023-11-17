import express from 'express'
import cookies from 'cookie-parser'

import usrRouter from './routes/usrRouter';
import authRouter from './routes/authRouter';

import prodRouter from './routes/prodRouter';
import merchRouter from './routes/merchRouter';
import catRouter from './routes/catRouter';
import fabRouter from './routes/fabRouter';
import tableRouter from './routes/tableRouter';

import Database from './models';
import allowCORS from './middleware/allowCORS';
import logger from './middleware/logger'


if(process.argv.includes('-f')) Database.delaySync({after: 4, force: true});
const app: express.Application = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb'
}));

app.use(cookies());

app.use(logger);
app.use(allowCORS);

app.use(tableRouter);
app.use(catRouter);
app.use(prodRouter);
app.use(usrRouter);
app.use(merchRouter);
app.use(fabRouter);
app.use(authRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('\x1b[35mServer is Listening!\x1b[0m' + ` (${port})`);
});
