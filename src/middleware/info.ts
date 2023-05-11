import { Request, Response, NextFunction } from "express";

export default ((req: Request, res: Response, next: NextFunction) => {
  let date = new Date().toLocaleString()
  console.log(`\nA client (\x1b[35m${req.ip}\x1b[0m) made a \x1b[35m${req.method} \x1b[0m Requistion at: \x1b[35m${date}\x1b[0m`+ 
  `\n${req.url} route`)
  next()
});