import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default {
  handleCookieRequest(req: Request, res: Response) {
    res.clearCookie('token');
    const {username, passwd, email} = req.body;

    if (username == process.env.MASTER_NAME && passwd == process.env.MASTER_SECRET) {
      const token = jwt.sign({username: username, passwd: passwd}, process.env.MASTER_AUTH_SECRET!, { expiresIn: "1h" })
      return res.cookie('token', token, { maxAge: 10000, httpOnly: true, secure: false }).status(200).send('Cookie Mestre Enviado'); 
    } 

    const token = jwt.sign({username: username, passwd: passwd, email: email}, process.env.COMMON_AUTH_SECRET!, {expiresIn: "7d"}); 
    return res.cookie(
      'token', token,
      {
        httpOnly: false,
        secure: process.env.DESIRED_ENV === "production",
        expires: new Date(Date.now() + (24 * 1000 * 60 * 60))
      }).status(200).send('Cookie Comum Enviado');
  },
}