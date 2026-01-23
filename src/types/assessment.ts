

export interface IAssessmentOption {
  option: string;
  isCorrect: boolean;
  isSelected: boolean;
}

export interface IAssessmentItem {
  quizId: string;
  attempted: boolean;
  options: IAssessmentOption[];
}

export interface IAssessment  {
  assessments: IAssessmentItem[];
  otherMarks: number;
  createdAt?: Date;
  updatedAt?: Date;
}