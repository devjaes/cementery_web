export interface UserBase {
  firstName: string;
  lastName: string;
  email: string;
}

export interface User extends UserBase {
  id: string;
}

export type UserCreate = UserBase;

export type UserUpdate = Partial<UserBase>;
