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
