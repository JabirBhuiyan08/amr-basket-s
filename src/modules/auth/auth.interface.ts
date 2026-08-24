export interface GoogleAuthRequest {
  code: string;
  redirectUri?: string | undefined;
}

export interface GoogleAuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | undefined;
      role: string;
    };
    token?: string;
  };
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string | undefined;
      role: string;
    };
  };
  error?: string;
}
