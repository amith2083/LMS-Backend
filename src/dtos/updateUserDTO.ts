import { IUser } from "../interfaces/user/IUser";

export interface UpdateUserDTO extends Partial<IUser> {
  oldPassword?: string;
  newPassword?: string;
}
