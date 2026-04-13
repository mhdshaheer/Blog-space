/**
 * User Data Transfer Object
 * Represents the user data sent to the client
 */
export interface UserDto {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
