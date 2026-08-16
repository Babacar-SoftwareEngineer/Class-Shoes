export interface AuthUser {
  UserId: number;
  Email: string;
  DisplayName?: string | null;
  FirstName?: string | null;
  LastName?: string | null;
  AuthId?: string | null;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: AuthUser;
}
