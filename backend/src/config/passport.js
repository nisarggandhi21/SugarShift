const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatarUrl = profile.photos?.[0]?.value;

        let user = await User.findByGoogleId(profile.id);
        if (!user && email) {
          const existing = await User.findByEmail(email);
          user = existing
            ? await User.linkGoogleId(existing.id, profile.id, avatarUrl)
            : await User.createGoogle(
                email,
                profile.id,
                profile.displayName,
                avatarUrl
              );
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email);
        if (!user || !user.password_hash) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return done(null, false, { message: "Invalid email or password" });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
