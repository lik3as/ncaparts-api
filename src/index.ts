import express from 'express'
import cookies from 'cookie-parser'

import cli from './routes/tables/router.cli';
import authUser from './routes/auth/authUser';

import util from './middleware/util'
import prod from './routes/tables/router.prod';
import merc from './routes/tables/router.merc';
import cats from './routes/tables/router.cats';
import fab from './routes/tables/router.fab';
import index from './routes';

import { Database } from 'ncaparts-db';

if(process.argv.includes('-f')) Database.delaySync({after: 4, force: true});
const app: express.Application = express()

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({
  limit: '50mb'
}));

app.use(cookies());

app.use(util.allow_origin);
app.use(util.info);

app.use(index);
app.use(cats);
app.use(prod);
app.use(cli);
app.use(merc);
app.use(fab);
app.use(authUser);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('\x1b[35mServer is Listening!\x1b[0m' + ` (${port})`);
});
