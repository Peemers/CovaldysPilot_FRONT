export enum Role {
  Admin = 'Admin',
  Membre = 'Membre'
}

export interface UserResponseDto {
  id: string;
  pseudo: string;
  email: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  role: Role;
  gender: string;
  birthday: string;
  isMembershipUpToDate: boolean;
  lastPayementDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserManuallyRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  pseudo: string;
  birthday: string;
  gender: string;
  isMembershipUpToDate: boolean;
}

export interface CreateUserManuallyResponseDto {
  id: string;
  pseudo: string;
  email: string;
  firstName: string;
  lastName?: string;
  isMembershipUpToDate: boolean;
  temporaryPassword: string;
}
