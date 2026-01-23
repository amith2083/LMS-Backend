import { Request, Response } from "express";



export interface IWatchController {
  getWatch(req: Request, res: Response): Promise<void>;
   createWatch(req: Request, res: Response): Promise<void>;
}
