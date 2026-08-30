import { prisma } from '../../lib/prisma';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';
const getGoogleTokens = async (code, redirectUri) => {
    const params = new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: redirectUri || `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
    });
    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google token exchange failed: ${response.status} ${errorText}`);
    }
    return response.json();
};
const getGoogleUser = async (accessToken) => {
    const response = await fetch(GOOGLE_USER_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch Google user: ${response.status} ${errorText}`);
    }
    return response.json();
};
const findOrCreateUser = async (googleUser) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: googleUser.email },
    });
    if (existingUser) {
        return prisma.user.update({
            where: { email: googleUser.email },
            data: {
                name: googleUser.name,
                image: googleUser.picture || existingUser.image,
            },
        });
    }
    return prisma.user.create({
        data: {
            email: googleUser.email,
            name: googleUser.name,
            image: googleUser.picture,
            role: 'USER',
            status: 'ACTIVE',
        },
    });
};
export const authService = {
    async googleAuth(data) {
        try {
            const tokens = await getGoogleTokens(data.code, data.redirectUri);
            const googleUser = await getGoogleUser(tokens.access_token);
            const user = await findOrCreateUser({
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                sub: googleUser.id,
            });
            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image ?? undefined,
                        role: user.role || 'USER',
                    },
                },
            };
        }
        catch (error) {
            console.error('Google auth error:', error);
            return {
                success: false,
                error: error?.message || 'Google authentication failed',
            };
        }
    },
    async getCurrentUser(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                    role: true,
                    phone: true,
                    status: true,
                },
            });
            if (!user) {
                return {
                    success: false,
                    error: 'User not found',
                };
            }
            return {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image ?? undefined,
                        role: user.role || 'USER',
                    },
                },
            };
        }
        catch (error) {
            return {
                success: false,
                error: error?.message || 'Failed to get user',
            };
        }
    },
};
//# sourceMappingURL=auth.service.js.map