require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const { Groq } = require('groq-sdk');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
const Scheme = require("./models/Scheme"); 
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const cheerio = require('cheerio');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String }],
  lastMessage: { type: messageSchema },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', async (data) => {
    try {

      const newMessage = new Message({
        sender: data.sender,
        receiver: data.receiver,
        message: data.message
      });
      await newMessage.save();

      await Conversation.findOneAndUpdate(
        { 
          participants: { $all: [data.sender, data.receiver] } 
        },
        { 
          $set: { 
            participants: [data.sender, data.receiver],
            lastMessage: newMessage 
          }
        },
        { upsert: true, new: true }
      );


      io.to(data.receiver).emit('receiveMessage', {
        sender: data.sender,
        message: data.message,
        timestamp: newMessage.timestamp
      });


      socket.emit('messageSent', { status: 'success' });
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('messageSendError', { error: 'Failed to send message' });
    }
  });


  socket.on('getMessageHistory', async (data) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: data.user1, receiver: data.user2 },
          { sender: data.user2, receiver: data.user1 }
        ]
      }).sort({ timestamp: 1 });

      socket.emit('messageHistory', messages);
    } catch (error) {
      console.error('Fetch messages error:', error);
    }
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.params.userId
    }).sort({ 'lastMessage.timestamp': -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

async function searchDuckDuckGo(query) {
  try {
    const response = await axios.get('https://html.duckduckgo.com/html/', {
      params: { q: query },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $('.result').each((i, element) => {
      if (i < 5) {
        const title = $(element).find('.result__title').text().trim();
        const snippet = $(element).find('.result__snippet').text().trim();
        const url = $(element).find('.result__url').text().trim();

        if (title && snippet) {
          results.push({ title, snippet, url });
        }
      }
    });
    return results;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return [];
  }
}

// Prompt Generation Function
function generatePrompt(question, schemeDetails, searchResults) {
  let basePrompt = `As an AI assistant specializing in government schemes and policies, help with the following question: ${question}\n\n`;
  
  if (schemeDetails) {
    basePrompt += `Scheme details:\n${JSON.stringify(schemeDetails)}\n\n`;
  }
  
  if (searchResults && searchResults.length > 0) {
    basePrompt += `Additional information from web search:\n`;
    searchResults.forEach((result, index) => {
      basePrompt += `Source ${index + 1}:\nTitle: ${result.title}\nSummary: ${result.snippet}\n\n`;
    });
  }
  
  basePrompt += `Please provide a clear, conversational response that:
  1. Directly addresses the question using all available information
  2. Highlights key benefits and eligibility criteria if applicable
  3. Uses simple, easy-to-understand language
  4. Includes specific examples where helpful
  5. Maintains cultural context and sensitivity
  6. Includes application process and requirements
  7. Provides relevant portal links for application
  8. Cites sources when using information from web search results
  9. You must give schemes if they ask it is mandatory 
  If no scheme information is directly relevant, provide a helpful general response based on the available information.`;

  return basePrompt;
}

// Passport Configuration (remains the same)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Authentication Routes
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/home",
    failureRedirect: "http://localhost:5173/login",
  })
);

app.get("/api/auth-status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
});

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

const responseCache = new Map();
const CACHE_DURATION = 3600000;


async function fetchSchemeDetails(schemeName) {
  try {
    const schemeFromDB = await Scheme.findOne({
      name: { $regex: new RegExp(schemeName, 'i') }
    });
    
    if (schemeFromDB) {
      return schemeFromDB;
    }
    const response = await axios.get(`https://api.mockapi.io/schemes/v1/schemes?name=${encodeURIComponent(schemeName)}`);
    if (!response.data || response.data.length === 0) {
      const npiResponse = await axios.get(
        `https://services.india.gov.in/service/listing?cat=41&ln=en&term=${encodeURIComponent(schemeName)}`
      );

      if (npiResponse.data) {
        const newScheme = new Scheme({
          name: schemeName,
          description: npiResponse.data.description || '',
        });
        await newScheme.save();
      }
      
      return npiResponse.data;
    }

    const schemeData = response.data[0];
    const newScheme = new Scheme({
      name: schemeData.name,
      description: schemeData.description || '',
    });
    await newScheme.save();
    
    return response.data;
  } catch (error) {
    console.error('Error fetching scheme details:', error);
    return null;
  }
}

// Main Ask Route with Groq
app.post('/ask', async (req, res) => {
  const { question } = req.body;
  
  if (!question) {
    return res.status(400).json({
      success: false,
      error: 'Missing question in request body',
    });
  }

  try {
    const cacheKey = question.toLowerCase();
    if (responseCache.has(cacheKey)) {
      const cachedResponse = responseCache.get(cacheKey);
      if (Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
        return res.json(cachedResponse.data);
      }
      responseCache.delete(cacheKey);
    }

    // Use Groq to extract scheme name
    const schemeNamePrompt = `Extract only the government scheme name from this question, if any: ${question}`;
    const schemeNameChat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: schemeNamePrompt }],
      model: "llama3-8b-8192"
    });
    const schemeName = schemeNameChat.choices[0]?.message?.content || '';

    const [schemeDetails, searchResults] = await Promise.all([
      schemeName ? fetchSchemeDetails(schemeName) : null,
      searchDuckDuckGo(`${question} government scheme india`)
    ]);

    const prompt = generatePrompt(question, schemeDetails, searchResults);
    
    // Generate response using Groq
    const responseChat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "llama3-8b-8192"
    });
    const aiResponse = responseChat.choices[0]?.message?.content || 'Unable to generate response';

    const finalResponse = {
      success: true,
      answer: aiResponse,
      schemeDetails: schemeDetails,
      searchResults: searchResults,
      applicationLink: schemeDetails?.applicationLink || 'https://services.india.gov.in'
    };

    responseCache.set(cacheKey, {
      data: finalResponse,
      timestamp: Date.now()
    });

    res.json(finalResponse);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      details: error.message
    });
  }
});


const GOVERNMENT_DOMAINS = [
  ".gov.in", ".nic.in", "india.gov.in", 
  "myscheme.gov.in", "digitalindia.gov.in"
];

const isGovernmentURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return GOVERNMENT_DOMAINS.some((domain) => parsedUrl.hostname.endsWith(domain));
  } catch (error) {
    return false; 
  }
};

const checkLinkStatus = async (url) => {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    return response.status >= 200 && response.status < 400;
  } catch (error) {
    return false; 
  }
};

app.post("/verify-link", async (req, res) => {
  const { link } = req.body;
  if (!link) {
    return res.status(400).json({ success: false, message: "Missing link parameter" });
  }
  const isGov = isGovernmentURL(link);
  const isValid = await checkLinkStatus(link);
  res.json({
    success: true,
    isGovernment: isGov,
    isValidLink: isValid,
    message: isGov
      ? isValid
        ? "Valid government website link"
        : "Government website is unreachable"
      : "Not a recognized government website"
  });
});

app.post('/clear-cache', (req, res) => {
  responseCache.clear();
  res.json({ success: true, message: 'Cache cleared successfully' });
});


const volunteerRoutes = require('./routes/volunteerRoutes');
app.use('/api', volunteerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));