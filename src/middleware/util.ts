import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export default {
  info(req: Request, res: Response, next: NextFunction) {
    if (!process.argv.includes('-v')) return next();
    let date = new Date().toLocaleString()
    console.log(`\nA client (\x1b[35m${req.ip}\x1b[0m) made a \x1b[35m${req.method} \x1b[0m Requistion at: \x1b[35m${date}\x1b[0m`+ 
    `\n${req.url} route`)

    next()
  },

  allow_origin(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  },
  
  verifyJWT(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies.token;
    if (!token) return res.status(403).send("Você não forneceu uma token.");
    
    jwt.verify(token, process.env.AUTH_SECRET!, (err, payload) => {
      if (err){
        return res.status(403).send("Token Inválida.");
      }
      console.log(payload)
      next()
    });
  }
}
