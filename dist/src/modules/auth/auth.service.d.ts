import { GoogleAuthRequest, GoogleAuthResponse, AuthResponse } from './auth.interface';
export declare const authService: {
    googleAuth(data: GoogleAuthRequest): Promise<GoogleAuthResponse>;
    getCurrentUser(userId: string): Promise<AuthResponse>;
};
//# sourceMappingURL=auth.service.d.ts.map