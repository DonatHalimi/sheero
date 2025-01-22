const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const Role = require('../models/Role');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET } = require('./dotenv');

// Google login strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
        },
        async (accessToken, _, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails[0].value;

                let user = await User.findOne({ email });

                if (user) {
                    // If Google ID is not already linked, add the googleId
                    if (!user.googleId) {
                        user.googleId = id;
                        await user.save();
                    }
                } else {
                    const defaultRole = await Role.findOne({ name: 'user' });
                    user = new User({
                        googleId: id,
                        firstName: displayName.split(' ')[0],
                        lastName: displayName.split(' ')[1] || '',
                        email,
                        password: id, // Dummy password
                        role: defaultRole._id,
                    });
                    await user.save();
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// Facebook login strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name'],
        },
        async (accessToken, _, profile, done) => {
            try {
                const { id, emails, name } = profile;
                const email = emails[0].value;

                let user = await User.findOne({ email });

                if (user) {
                    // If Facebook ID is not already linked, add the facebookId
                    if (!user.facebookId) {
                        user.facebookId = id;
                        await user.save();
                    }
                } else {
                    const defaultRole = await Role.findOne({ name: 'user' });
                    user = new User({
                        facebookId: id,
                        firstName: name.givenName,
                        lastName: name.familyName,
                        email,
                        password: id, // Dummy password
                        role: defaultRole._id,
                    });
                    await user.save();
                }

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).populate('role');
    done(null, user);
});

module.exports = passport;