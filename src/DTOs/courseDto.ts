export interface CreateCourseResponseDTO {
  _id: string;
  title: string;
  description: string;
}

export interface UpdateCourseResponseDTO {
  _id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number;
  status?: boolean;
  category?: string;
  quizSet?: string;
  updatedAt?: Date;
}
export interface UpdateCourseImageResponse {
  _id: string;
  thumbnail?: string;
}

