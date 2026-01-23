export interface IReport {
  totalCompletedLessons: string[];
  totalCompletedModules: string[];
  course: string;
  student: string;
  quizAssessment?: string;
  completionDate: Date;
}
