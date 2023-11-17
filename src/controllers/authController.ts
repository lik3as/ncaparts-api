import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default {
  handleCookieRequest(req: Request, res: Response) {
    res.clearCookie('token');
    const {username, passwd, email} = req.body;

    if (username == process.env.MASTER_NAME && passwd == process.env.MASTER_SECRET) {
      const token = jwt.sign({username: username, passwd: passwd, email: email}, process.env.MASTER_AUTH_SECRET!, { expiresIn: "1h" })
      return res.cookie('token', token, { maxAge: 10000, httpOnly: true, secure: false }).status(200).send('Cookie Mestre Enviado'); 
    } 

    const token = jwt.sign({username: username, passwd: passwd, email: email}, process.env.COMMON_AUTH_SECRET!, {expiresIn: "7d"}); 
    return res.cookie(
      'token', token,
      {
        httpOnly: false,
        secure: process.env.DESIRED_ENV === "production",
        expires: new Date(Date.now() + (24 * 1000 * 60 * 60))
      }
    ).status(200).send('Cookie Comum Enviado');
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
    const token: string | undefined = req.cookies.cookieToken || req.cookies.token;
    if (!token) return res.status(400).send("Você não forneceu uma token.");
    
    jwt.verify(token, process.env.COMMON_AUTH_SECRET!, (err, payload) => {
      if (err){
        jwt.verify(token, process.env.MASTER_AUTH_SECRET!, (err, payload) => {
          if (err) {
            return res.status(403).send("Token Inválida.");
          }
        })
      }
      next()
    });
  }
}