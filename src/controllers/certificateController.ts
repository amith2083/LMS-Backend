
import { Request, Response } from 'express';
import { CertificateService } from '../services/certificateService';
import { ICertificateService } from '../interfaces/certificate/ICertificateService';


export class CertificateController {
 constructor(private certificateService: ICertificateService) {}

  async generateCertificate(req: Request, res: Response) {
    const { courseId } = req.params;
    const userId = req.user.id

    const pdfBuffer = await this.certificateService.generateCertificate(userId, courseId);

    res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${courseId}.pdf"`,
        'Cache-Control': 'no-cache',
      })
      .send(pdfBuffer);
  }
}