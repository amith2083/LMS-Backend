import  {  Document } from "mongoose";


export interface IQuiz extends Document {
  title: string;
  description?: string;
  slug?: string;
  explanations?: string;
  options?: any[]; 
  mark: number;
}