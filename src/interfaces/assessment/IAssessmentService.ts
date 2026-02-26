export interface IAssessmentService {
  addQuizAssessment(
      user: string,
    course: string,
    quizSet: string,
    answers: { quizId: string; options: { option: string }[] }[]
  ): Promise<void>;
}
