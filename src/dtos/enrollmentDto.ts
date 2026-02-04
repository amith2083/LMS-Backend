export interface ConfirmEnrollmentResponseDTO {
 _id: string;
  status: "not-started" | "in-progress" | "completed";
  course: {
    _id: string;
    title: string;
    price: number;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
}
