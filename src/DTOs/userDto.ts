export interface UserResponseDTO {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  profilePicture?: string;
  bio?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
  createdAt: Date;

}

export interface UpdateUserResponseDTO {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  profilePicture?: string;
  bio?: string;
  website?: string;
  designation?: string;
   doc?: string;
  phone?: number;
  isBlocked?: boolean;
  updatedAt: Date;
}

export interface GetEmailUserResponseDTO {
  _id: string;
  name: string;
  email: string;
  password:string;
  role: 'admin' | 'instructor' | 'student';
isBlocked?: boolean;
  isEmailVerified?: boolean;
  isVerified?: boolean;
}

export interface LoginUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  profilePicture?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
}



