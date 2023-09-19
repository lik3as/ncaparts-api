import { Response, Request, NextFunction } from "express";

export default interface Write{
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  createMany(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
}