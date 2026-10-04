import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

// OAuth state is kept in a cookie between the initial sign-in request and the
// provider callback. `SameSite=None` requires HTTPS, so it is not valid for a
// local `http://localhost` server. Production uses separate Vercel/Render
// origins and therefore needs `SameSite=None` + `Secure`.
const authBaseURL = process.env.BETTER_AUTH_URL || "http://localhost:5000";
const isLocalAuthServer = /(^|\/\/)(localhost|127\.0\.0\.1)(:\d+)?(?=\/|$)/i.test(authBaseURL);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
      secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    process.env.FRONTEND_URL,
    "https://amrbasket.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "https://amrbasket.vercel.app",
  ].filter((origin): origin is string => origin !== undefined && origin !== ""),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              emailVerified: true,
            },
          };
        },
      },
    },
  },
emailAndPassword: {
     enabled: true,
     autoSignIn: true,
     requireEmailVerification: false,
     sendResetPassword: async ({ user, url, token }, request) => {
       try {
         const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
         const info = await transporter.sendMail({
           from: '"Prisma Blog" <prismablog@gmail.email>',
           to: user.email,
           subject: "Reset your password",
           text: "",
           html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset your password</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;"><tr><td style="background:#111827;padding:20px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:22px;">Prisma Blog</h1></td></tr><tr><td style="padding:32px;color:#374151;"><h2 style="margin-top:0;color:#111827;">Reset your password</h2><p style="font-size:15px;line-height:1.6;">We received a request to reset your password for your Prisma Blog account. Click the button below to reset it. This password reset link will expire in 1 hour.</p><div style="text-align:center;margin:32px 0;"><a href="${resetUrl}" style="background:#2563eb;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:15px;border-radius:6px;display:inline-block;">Reset Password</a></div><p style="font-size:14px;line-height:1.6;color:#6b7280;">If you didn’t request a password reset, please ignore this email or contact support if you have questions.</p></td></tr><tr><td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Prisma Blog. All rights reserved.</td></tr></table></table></body></html>`,
         });
         console.log("Reset email sent:", info.messageId);
       } catch (err) {
         console.log(err);
         throw new Error("Failed to send reset email");
       }
     },
   },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prismablog@gmail.email>',
          to: user.email,
          subject: "Please verify your email address",
          text: "",
          html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Verify your email</title></head><body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:24px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;"><tr><td style="background:#111827;padding:20px;text-align:center;"><h1 style="margin:0;color:#ffffff;font-size:22px;">Prisma Blog</h1></td></tr><tr><td style="padding:32px;color:#374151;"><h2 style="margin-top:0;color:#111827;">Verify your email address</h2><p style="font-size:15px;line-height:1.6;">Thanks for signing up for <strong>Prisma Blog</strong>. Please confirm your email address by clicking the button below.</p><div style="text-align:center;margin:32px 0;"><a href="${verificationUrl}" style="background:#2563eb;color:#ffffff;padding:14px 28px;text-decoration:none;font-size:15px;border-radius:6px;display:inline-block;">Verify Email</a></div><p style="font-size:14px;line-height:1.6;color:#6b7280;">If the button doesn’t work, copy and paste this link into your browser:</p><p style="word-break:break-all;font-size:13px;color:#2563eb;">${verificationUrl}</p><p style="font-size:14px;color:#6b7280;margin-top:24px;">If you didn’t create an account, you can safely ignore this email.</p></td></tr><tr><td style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Prisma Blog. All rights reserved.</td></tr></table></table></body></html>`,
        });
        console.log("Message sent:", info.messageId);
      } catch (err) {
        console.log(err);
        throw new Error("Failed to send verification email");
      }
    },
  },
  account: {
    // Store the OAuth state in the database so the Vercel -> Render flow does
    // not depend on a third-party state cookie surviving the initial request.
    // The state and PKCE values are still validated server-side on callback.
    storeStateStrategy: "database",
    skipStateCookieCheck: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: isLocalAuthServer ? "lax" : "none",
      secure: !isLocalAuthServer,
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${authBaseURL.replace(/\/$/, "")}/api/auth/callback/google`,
    },
  },
});

