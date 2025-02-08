require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// MongoDB User Schema
const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  picture: String
});

const User = mongoose.model('OAuth', UserSchema);

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set to true if using HTTPS
    maxAge: 48 * 60 * 60 * 1000 // 2 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
      }
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('http://localhost:5173');
  }
);

app.get('/api/user', (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);

  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(req.user);
});

app.get('/api/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy();
    res.redirect('http://localhost:5173');
  });
});

// Connect to MongoDB and Start Server
mongoose.connect('mongodb+srv://saran:saranraj7s@cluster0.3nrdw.mongodb.net/sample')
  .then(() => {
    app.listen(5000, () => console.log('✅ Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
