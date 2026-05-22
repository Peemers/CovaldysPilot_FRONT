export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  pseudo: string;
  role: string;
  expiresAt: string;
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
}

export interface ConnectedUser {
  userId: string;
  pseudo: string;
  role: string;
  isMembershipUpToDate: boolean;
}
