import sCli from './services/srv.cli'
import sFab from './services/srv.fab'
import sKit from './services/srv.kit'
import sLogi from './services/srv.logi'
import sMerc from './services/srv.merc'
import sProd from './services/srv.prod'
import sVen from './services/srv.ven'

export {
  Cliente,
  Fabricante,
  Kit,
  Logistica,
  Mercadoria,
  Produto,
  Venda,
  ProdFab,
  ProdKit,
  Versao,
  Tipo,
  Subtipo,
  Marca,
  Modelo
  
  as models
} from './models/index'

export { sCli, sFab, sKit, sLogi, sMerc, sProd, sVen }