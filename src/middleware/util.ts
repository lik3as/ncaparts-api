import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export default {
  info(req: Request, res: Response, next: NextFunction) {
    if (!process.argv.includes('-v')) return next();
    const cookie = req.cookies.token;
    let date = new Date().toLocaleString()
    console.log(`\nA client (\x1b[35m${req.ip}\x1b[0m) made a \x1b[35m${req.method} \x1b[0m Requistion at: \x1b[35m${date}\x1b[0m`+ 
    `\n${req.url} route (${cookie})`)

    next()
  },

  allow_origin(req: Request, res: Response, next: NextFunction) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  },
  
  verifyMasterJWT(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies.token;
    if (!token) return res.status(400).send("Você não forneceu uma token.");
    
    jwt.verify(token, process.env.MASTER_AUTH_SECRET!, (err, payload) => {
      if (err){
        return res.status(403).send("Token Inválida.");
      }
      next()
    });
  },

  verifyCommonJWT(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies.token;
    if (!token) return res.status(400).send("Você não forneceu uma token.");
    
    jwt.verify(token, process.env.COMMON_AUTH_SECRET!, (err, payload) => {
      if (err){
        return res.status(403).send("Token Inválida.");
      }
      next()
    });
  }
}
