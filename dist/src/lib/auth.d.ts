export declare const auth: import("better-auth").Auth<{
    baseURL: string | undefined;
    secret: string | undefined;
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    trustedOrigins: string[];
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            status: {
                type: "string";
                defaultValue: string;
                required: false;
            };
        };
    };
    databaseHooks: {
        user: {
            create: {
                before: (user: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image?: string | null | undefined;
                } & Record<string, unknown>) => Promise<{
                    data: {
                        emailVerified: true;
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        email: string;
                        name: string;
                        image?: string | null | undefined;
                    };
                }>;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
        autoSignIn: true;
        requireEmailVerification: false;
        sendResetPassword: ({ user, url, token }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }, request: Request | undefined) => Promise<void>;
    };
    emailVerification: {
        sendOnSignUp: false;
        autoSignInAfterVerification: true;
        sendVerificationEmail: ({ user, url, token }: {
            user: import("better-auth").User;
            url: string;
            token: string;
        }, request: Request | undefined) => Promise<void>;
    };
    account: {
        storeStateStrategy: "cookie";
    };
    advanced: {
        defaultCookieAttributes: {
            sameSite: "lax";
            secure: false;
        };
    };
    socialProviders: {
        google: {
            prompt: "select_account consent";
            accessType: "offline";
            clientId: string;
            clientSecret: string;
        };
    };
}>;
//# sourceMappingURL=auth.d.ts.map