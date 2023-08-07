import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default {
  handleCookieRequest(req: Request, res: Response) {
    res.clearCookie('token');
    const {name, passwd} = req.body;

    if (name == process.env.MASTER_NAME && passwd == process.env.MASTER_SECRET) {
      const token = jwt.sign({nome: name, senha: passwd}, process.env.AUTH_SECRET!, { expiresIn: "1h" })
      return res.cookie('token', token, { maxAge: 10000, httpOnly: false, secure: false }).status(200).send('Cookie Enviado'); 
    }

    return res.status(403).send("Login inválido");
  },
}