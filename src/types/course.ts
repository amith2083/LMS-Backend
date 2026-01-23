export interface ICourse {
  title?: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  status?: boolean;
  category?:string;
  quizSet?:string;
  testimonials?:string[]
}