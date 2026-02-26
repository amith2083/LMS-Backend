

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
  user:string,
  course:string,
  quizSet:string,
  assessments: IAssessmentItem[];
  actualMark:number,
  totalScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}