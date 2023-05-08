import { Request, Response, NextFunction } from "express";

export default ((req: Request, res: Response, next: NextFunction) => {
  let date = new Date().toLocaleString()
  console.log(`A client made a \x1b[35m${req.method} \x1b[0m Requistion at: \x1b[35m${date} \x1b[0m`)
  next()
})