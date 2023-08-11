import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default {
  handleCookieRequest(req: Request, res: Response) {
    res.clearCookie('token');
    const {name, passwd, email} = req.body;

    if (name == process.env.MASTER_NAME && passwd == process.env.MASTER_SECRET) {
      const token = jwt.sign({username: name, passwd: passwd}, process.env.MASTER_AUTH_SECRET!, { expiresIn: "1h" })
      return res.cookie('token', token, { maxAge: 10000, httpOnly: false, secure: false }).status(200).send('Cookie Mestre Enviado'); 
    } 

    const token = jwt.sign({username: name, passwd: passwd, email: email}, process.env.COMMON_AUTH_SECRET!, {expiresIn: "7d"}); 
    return res.cookie('token', token, {maxAge: 10000, httpOnly: true, secure: true}).status(200).send('Cookie Comum Enviado');
  },
}