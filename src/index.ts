import express from 'express'
import util from './middleware/util'
import router_prod from './routes/tables/router.prod';
import router_cli from './routes/tables/router.cli';
import router_tables from './routes/router.manager';
import { sequelize, delaySync } from 'ncaparts-db'

//delaySync(sequelize, { after: 3, force: true })

const app: express.Application = express()

app.use(express.json());
app.use(util.info);

app.use(router_tables);
app.use(router_prod);
app.use(router_cli);

app.listen(8080, () => {
  console.log('\x1b[35mServer is Listening!\x1b[0m');
});
