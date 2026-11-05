import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { db } from './mongodb';

const secret = process.env.BETTER_AUTH_SECRET || 'booknook-dev-insecure-secret-key-32-chars-min';
const baseURL = process.env.BETTER_AUTH_URL || 'http://localhost:3000';

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL,
  secret,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },
  trustedOrigins: [
    baseURL,
    'http://localhost:3000',
  ],
});

export type Session = typeof auth.$Infer.Session;
