import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { formatMyDate } from "../utils/formatMyDate";
import { ICourseRepository } from "../interfaces/course/ICourseRepository";
import { IReportRepository } from "../interfaces/report/IReportRespository";
import { IUserRepository } from "../interfaces/user/IUserRepository";
import fs from 'fs';
import path from 'path';

const getPublicFilePath = (filePath: string): string => {
  return path.join(process.cwd(), 'public', filePath);
};

// Load all assets once at startup (best performance)

const assets = {
  fonts: {
    kalam: fs.readFileSync(getPublicFilePath('fonts/kalam/Kalam-Regular.ttf')),
    montserrat: fs.readFileSync(getPublicFilePath('fonts/montserrat/Montserrat-Medium.ttf')),
    montserratItalic: fs.readFileSync(getPublicFilePath('fonts/montserrat/Montserrat-Italic.ttf')),
  },
  images: {
    logo: fs.readFileSync(getPublicFilePath('logo.png')),
    sign: fs.readFileSync(getPublicFilePath('sign.png')),
    pattern: fs.readFileSync(getPublicFilePath('pattern.jpg')),
  },
};

export class CertificateService {
  constructor(
    private courseRepository: ICourseRepository,
    private reportRepository: IReportRepository,
    private userRepository: IUserRepository
  ) {}

  async generateCertificate(studentId: string, courseId: string) {
    const [course, student, report] = await Promise.all([
      this.courseRepository.getCourse(courseId),
      this.userRepository.getUserById(studentId),
      this.reportRepository.getReportByCourseAndUser(courseId,studentId ),
    ]);

    if (!course) throw new Error("Course not found");
    if (!student) throw new Error("User not found");
    if (!report || !report.completionDate)
      throw new Error("Course not completed");

    const completionDate = report.completionDate
      ? formatMyDate(report.completionDate)
      : formatMyDate(new Date());

    const info = {
      name: `${student.name} `,
      completionDate,
      courseName: course.title,
      instructorName: `${course?.instructor?.name}`,
      instructorDesignation: course?.instructor?.designation || "Instructor",
    };

    // ── Generate PDF (same as your old code) ──
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

 // Embed fonts
    const kalamFont = await pdfDoc.embedFont(assets.fonts.kalam);
    const montserrat = await pdfDoc.embedFont(assets.fonts.montserrat);
    const montserratItalic = await pdfDoc.embedFont(assets.fonts.montserratItalic);

    // Embed images
    const logo = await pdfDoc.embedPng(assets.images.logo);
    const sign = await pdfDoc.embedPng(assets.images.sign);
    const pattern = await pdfDoc.embedJpg(assets.images.pattern);

// A4 Landscape
    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();

    // Background pattern (subtle)
    page.drawImage(pattern, {
      x: 0,
      y: 0,
      width,
      height,
      opacity: 0.12,
    });

    // Logo
    const logoDims = logo.scale(0.2);
    page.drawImage(logo, {
      x: width / 2 - logoDims.width / 2,
      y: height - 150,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Title
    const title = "Certificate of Completion";
    const titleWidth = montserrat.widthOfTextAtSize(title, 38);
    page.drawText(title, {
      x: width / 2 - titleWidth / 2,
      y: height - 200,
      size: 38,
      font: montserrat,
      color: rgb(0, 0.53, 0.71),
    });

    // "This certificate is proudly presented to"
    const subtitle = "This certificate is proudly presented to";
    const subtitleWidth = montserratItalic.widthOfTextAtSize(subtitle, 20);
    page.drawText(subtitle, {
      x: width / 2 - subtitleWidth / 2,
      y: height - 260,
      size: 20,
      font: montserratItalic,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Student Name (big & beautiful)
    const nameWidth = kalamFont.widthOfTextAtSize(info.name, 52);
    page.drawText(info.name, {
      x: width / 2 - nameWidth / 2,
      y: height - 320,
      size: 52,
      font: kalamFont,
      color: rgb(0, 0, 0),
    });

    // Course completion text
    const details = `for successfully completing the course "${info.courseName}" on ${info.completionDate}`;
    page.drawText(details, {
      x: 80,
      y: height - 390,
      size: 18,
      font: montserrat,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: width - 160,
      lineHeight: 26,
      wordBreaks: [" "],
    });

    // Signature block
    page.drawImage(sign, {
      x: width - 320,
      y: 80,
      width: 200,
      height: 60,
    });

    page.drawText(info.instructorName, {
      x: width - 320,
      y: 60,
      size: 16,
      font: montserrat,
      color: rgb(0, 0, 0),
    });

    page.drawText(info.instructorDesignation, {
      x: width - 320,
      y: 40,
      size: 12,
      font: montserratItalic,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Horizontal line under signature
    page.drawLine({
      start: { x: width - 320, y: 75 },
      end: { x: width - 100, y: 75 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Final PDF bytes
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }
}
