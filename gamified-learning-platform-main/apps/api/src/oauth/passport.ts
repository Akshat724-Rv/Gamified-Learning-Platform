import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config/envVariables';
import { db } from '../config/firebase';

const BASE_URL = process.env.BASE_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error('Missing OAuth credentials in environment variables');
}

if (!BASE_URL) {
    throw new Error('Missing BASE_URL in environment variables');
}

type SafeUser = {
    id: string;
    email: string;
};

passport.serializeUser((user: Express.User, done) => {
    done(null, (user as SafeUser).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const snap = await db.collection('users').doc(id).get();
        if (!snap.exists) return done(null, false);
        const data = snap.data() as any;
        done(null, { id: snap.id, email: data?.email } as SafeUser);
    } catch (err) {
        done(err as Error);
    }
});

passport.use(
    'google',
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
            callbackURL: `${BASE_URL}/auth/google/callback`,
        },
        async (_accessToken: string, _refreshToken: string, profile: Profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    done(new Error('No email found in Google profile'));
                    return;
                }

                // Try to find user by providerId first
                const providerId = profile.id;
                const byProvider = await db.collection('users').where('provider', '==', 'google').where('providerId', '==', providerId).limit(1).get();
                let userDocId: string | null = null;

                if (!byProvider.empty) {
                    userDocId = byProvider.docs[0].id;
                } else {
                    // Fallback: look by email
                    const byEmail = await db.collection('users').where('email', '==', email).limit(1).get();
                    if (!byEmail.empty) {
                        userDocId = byEmail.docs[0].id;
                        // attach provider info
                        await db.collection('users').doc(userDocId).set({
                            provider: 'google',
                            providerId,
                            isMailVerified: true,
                            displayName: profile.displayName || '',
                            photoURL: profile.photos?.[0]?.value || '',
                            updatedAt: (await import('firebase-admin')).default.firestore.FieldValue.serverTimestamp(),
                        }, { merge: true });
                    } else {
                        // Create new user
                        const nowField = (await import('firebase-admin')).default.firestore.FieldValue.serverTimestamp();
                        const newRef = db.collection('users').doc();
                        await newRef.set({
                            uid: newRef.id,
                            email,
                            displayName: profile.displayName || '',
                            photoURL: profile.photos?.[0]?.value || '',
                            role: 'student',
                            badges: [],
                            provider: 'google',
                            providerId,
                            isMailVerified: true,
                            createdAt: nowField,
                            updatedAt: nowField,
                        });
                        userDocId = newRef.id;
                    }
                }

                const safeUser: SafeUser = { id: userDocId!, email };
                done(null, safeUser);
                return;
            } catch (err) {
                done(err as Error);
                return;
            }
        }
    )
);

export default passport;