
import { Request, Response } from 'express';
import { CertificateService } from '../services/certificateService';
import { ICertificateService } from '../interfaces/certificate/ICertificateService';

import { AppError } from '../utils/asyncHandler';
import { STATUS_CODES } from '../constants/http';


export class CertificateController {
 constructor(private certificateService: ICertificateService) {}

  async generateCertificate(req: Request, res: Response) {
    const { courseId } = req.params;
      if (!req.user) {
        throw new AppError(STATUS_CODES.UNAUTHORIZED, 'Unauthorized');
      }
       const studenId = req.user.id
    

    const pdfBuffer = await this.certificateService.generateCertificate(studenId, courseId);

    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${courseId}.pdf"`,
        'Cache-Control': 'no-cache',
      })
      .send(pdfBuffer);
  }
}