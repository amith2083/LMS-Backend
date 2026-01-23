


export interface IModule  {
  title: string;
  description?: string;
  status?: boolean;
  slug: string;
  courseId: string;
  lessonIds?: string[];
  order: number;
}