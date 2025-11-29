export interface IAssessmentService {
  addQuizAssessment(
    courseId: string,
    userId: string,
    quizSetId: string,
    answers: { quizId: string; options: { option: string }[] }[]
  ): Promise<void>;
}
