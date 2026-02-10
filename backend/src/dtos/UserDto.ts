export interface UserDto {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
