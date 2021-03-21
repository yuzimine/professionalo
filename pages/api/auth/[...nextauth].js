import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import crypto from 'crypto';

import firebaseRead from '../../../lib/firebaseRead';

const options = {
  site: process.env.NEXTAUTH_URL,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signin',
  },
  callbacks: {
    signIn: async (user, account, profile) => {
      if (account.provider === 'google' && !profile.verified_email) {
        // only allowed verified email addresses to be logged on
        return Promise.resolve(false);
      }

      if (await firebaseRead(`/users/${crypto.createHash('sha1').update(profile.email).digest('hex')}`)) {
        return Promise.resolve(true);
      }
      return Promise.reject('/register/new');
    },
    session: async (session) => {
      // add a unique user ID value with the session based on a hash of the user's email
      return Promise.resolve({
        ...session,
        user: {
          ...session.user,
          id: crypto.createHash('sha1').update(session.user.email).digest('hex'),
        }
      });
    },
  },
  providers: [
    Providers.Credentials({
      authorize: async (credentials) => {
        const id = crypto.createHash('sha1').update(credentials.email).digest('hex');
        const validate = await firebaseRead(`/users/${id}`);

        if (validate && validate.email === credentials.email && validate.password === credentials.password) {
          const user = { id, name: validate.displayName.pValue.en, email: validate.email };
          return Promise.resolve(user);
        }
        return Promise.resolve(false);
      }
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    }),
    // Providers.Slack({
    //   clientId: process.env.SLACK_CLIENT_ID,
    //   clientSecret: process.env.SLACK_CLIENT_SECRET
    // }),
  ],

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
};

export default (req, res) => NextAuth(req, res, options);