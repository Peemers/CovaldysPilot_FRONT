export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  pseudo: string;
  role: string;
  expiresAt: string;
  firstName: string;
  lastName?: string;
  isMembershipUpToDate: boolean;
}

export interface LoginRequest {
  emailOrPseudo: string;
  password: string;
}

export interface RegisterRequest {
  pseudo: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  gender?: string;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
}

export interface ConnectedUser {
  userId: string;
  pseudo: string;
  role: string;
  isMembershipUpToDate: boolean;
  firstName: string;
  lastName?: string;
}

export interface ChangePasswordRequestDto{
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

