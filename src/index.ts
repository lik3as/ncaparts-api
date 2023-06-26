import express from 'express'
import util from './middleware/util'
import router_prod from './routes/tables/router.prod';
import router_cli from './routes/tables/router.cli';
import router_tables from './routes/router.manager';
import router_merc from './routes/tables/router.merc';
import { sequelize, delaySync } from 'ncaparts-db'

//delaySync(sequelize, { after: 3, alter: true })

const app: express.Application = express()

app.use(express.json());
app.use(util.allow_origin);
app.use(util.info);

app.use(router_tables);
app.use(router_prod);
app.use(router_cli);
app.use(router_merc);

app.listen(8080, () => {
  console.log('\x1b[35mServer is Listening!\x1b[0m');
});
