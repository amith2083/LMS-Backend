

export interface ICertificateService {
  generateCertificate(studentId: string, courseId: string): Promise<Buffer>;
}