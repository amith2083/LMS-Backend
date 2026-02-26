import { IAssessmentService } from "../interfaces/assessment/IAssessmentService";
import { IAssessmentRepository } from "../interfaces/assessment/IAssessmentRepository";
import { IQuizSetRepository } from "../interfaces/quiz/IQuizsSetRepository";
import { IReportRepository } from "../interfaces/report/IReportRespository";

export class AssessmentService implements IAssessmentService {
  constructor(
    private assessmentRepository: IAssessmentRepository,
    private quizSetRepository: IQuizSetRepository,
    private reportRepository: IReportRepository,
  ) {}

  async addQuizAssessment(
    courseId: string,
    userId: string,
    quizSetId: string,
    answers: { quizId: string; options: { option: string }[] }[],
  ): Promise<void> {
    // 1. Get quiz set with populated quizzes
    const quizSet = await this.quizSetRepository.getQuizsetById(quizSetId);
    if (!quizSet) throw new Error("Quiz set not found");

    const quizzes = quizSet.quizIds || [];

    // 2. Build assessment record
    const assessmentRecord = quizzes.map((quiz) => {
      const userAnswer = answers.find((a) => a.quizId === quiz._id.toString());

      const mergedOptions =
        quiz?.options?.map((opt: any) => ({
          option: opt.text,
          isCorrect: opt.is_correct,
          isSelected:
            userAnswer?.options.some((uo) => uo.option === opt.text) || false,
        })) ?? [];

      return {
        quizId: quiz._id.toString(),
        attempted: !!userAnswer,
        options: mergedOptions,
      };
    });
    // 3. Calculate total score
    let calculatedScore = 0;
    let totalPossible = 0;

    assessmentRecord.forEach((record) => {
      const correctOptions = record.options.filter((opt) => opt.isCorrect);
      const selectedCorrect = record.options.filter(
        (opt) => opt.isSelected && opt.isCorrect,
      ).length;

      // Count maximum possible points for this question
      totalPossible += correctOptions.length*2;

      // Award +2 for each correct selection
      calculatedScore += selectedCorrect * 2;
    });

    // 3. Create assessment
    const assessment = await this.assessmentRepository.createAssessment({
      user: userId,
      course: courseId,
      quizSet: quizSetId,
      assessments: assessmentRecord,
      actualMark:totalPossible,
      totalScore: calculatedScore,

    });

    // 4. Link to report (create if not exists)
    let report = await this.reportRepository.getReportByCourseAndUser(
      courseId,
      userId,
    );
    if (!report) {
      report = await this.reportRepository.create({
        course: courseId,
        student: userId,
        quizAssessment: assessment._id.toString(),
      });
    } else {
      await this.reportRepository.updateReport(report._id.toString(), {
        quizAssessment: assessment._id.toString(),
      });
    }
  }
}
