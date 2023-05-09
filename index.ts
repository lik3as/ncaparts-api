import express from 'express'
import infos from './middleware/info'
import router_prod from './routes/router.prod';
import router_cli from './routes/router.cli';

const app: express.Application = express()

app.use(express.json());
app.use(infos);

app.use(router_prod);
app.use(router_cli);

app.listen(8080, () => {
  console.log('\x1b[35mServer is Listening!\x1b[0m\n');
});
