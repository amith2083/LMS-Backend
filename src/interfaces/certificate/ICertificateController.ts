import { Request, Response } from "express";

export interface ICertificateController {
  generateCertificate(req: Request, res: Response): Promise<void>;
}