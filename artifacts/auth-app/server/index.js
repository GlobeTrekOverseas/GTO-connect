import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import University from './models/University.js';
import Application from './models/Application.js';

function loadLocalEnvironment() {
  const environmentFile = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(environmentFile)) return;

  for (const rawLine of fs.readFileSync(environmentFile, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf('=');
    if (separator <= 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnvironment();

// Some local networks do not resolve MongoDB Atlas SRV records through their
// default DNS server.  A configured resolver keeps this workaround explicit
// and optional rather than hard-coding it into the connection string.
const dnsServers = (process.env.DNS_SERVERS || '')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);
if (dnsServers.length) dns.setServers(dnsServers);

const app = express();
const port = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT_SECRET must be configured before starting the API.');
let databaseError = null;
const demoUser = { id: 'demo-user', name: 'Ananya Sharma', email: 'demo@gtoconnect.com', mobile: '9876543210' };
const demoApplications = [];
const localUsers = new Map();
const localApplications = new Map();

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();
const databaseOnline = () => mongoose.connection.readyState === 1;
const mongoConnectionString = () => {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/globetrek';
  const directHosts = (process.env.MONGODB_DIRECT_HOSTS || '').trim();
  if (!directHosts || !configuredUri.startsWith('mongodb+srv://')) return configuredUri;

  // Atlas normally uses DNS SRV lookups.  Permit an explicit, TLS-secured
  // replica-set URI on networks where SRV DNS is blocked, while keeping the
  // credentials in the original MONGODB_URI environment variable.
  const parts = configuredUri.match(/^mongodb\+srv:\/\/([^@]+)@[^/]+(\/[^?]*)(?:\?([^#]*))?$/);
  if (!parts) return configuredUri;
  const options = new URLSearchParams(parts[3] || '');
  for (const [key, value] of new URLSearchParams(process.env.MONGODB_DIRECT_OPTIONS || '')) {
    options.set(key, value);
  }
  return 'mongodb://' + parts[1] + '@' + directHosts + parts[2] + '?' + options.toString();
};
const createAuthResponse = (user) => ({
  token: jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' }),
  user: { id: user.id, name: user.name, email: user.email },
});

function getGlobeTrekProfile(history, message) {
  const transcript = [...(Array.isArray(history) ? history : []), { content: message }]
    .map((entry) => String(entry?.content || ''))
    .join(' ')
    .toLowerCase();

  const countryMap = [
    ['United Kingdom', /\b(uk|united kingdom|britain|england)\b/],
    ['Canada', /\bcanada\b/],
    ['Australia', /\baustralia\b/],
    ['USA', /\b(usa|u s a|united states|america)\b/],
    ['Germany', /\bgermany\b/],
    ['Ireland', /\bireland\b/],
    ['New Zealand', /\bnew zealand\b/],
    ['France', /\bfrance\b/],
  ];
  const country = countryMap.find(([, test]) => test.test(transcript))?.[0];
  const courseMap = [
    ['MBA', /\bmba\b|master of business administration/],
    ['Computer Science / IT', /computer science|\bit\b|software|data science|artificial intelligence|cyber/],
    ['Engineering', /engineering|mechanical|civil|electrical/],
    ['Business / Management', /business|management|finance|marketing|accounting/],
    ['Health / Nursing', /nursing|health|medicine|medical|pharmacy/],
    ['Design / Media', /design|animation|media|fashion|architecture/],
    ['Law', /\blaw\b|legal/],
  ];
  const course = courseMap.find(([, test]) => test.test(transcript))?.[0];
  const intake = transcript.match(/\b(january|february|march|may|july|august|september|october|november|december)\s*(20\d{2})?\b/i)?.[0]
    || transcript.match(/\b20\d{2}\b/)?.[0];
  const budget = transcript.match(/(?:₹|rs\.?|inr|\$|cad|aud|gbp|€|eur)\s?\d[\d,]*/i)?.[0];
  return { country, course, intake, budget };
}

function nextQuestion(profile) {
  const missing = [];
  if (!profile.country) missing.push('destination');
  if (!profile.course) missing.push('course');
  if (!profile.budget) missing.push('budget');
  if (!profile.intake) missing.push('intake');
  return missing.length ? 'To personalise the next step, share your ' + missing.slice(0, 2).join(' and ') + '.' : 'You have enough detail to begin a university shortlist in the Universities tab.';
}

function getGlobeTrekReply(input, history = []) {
  const original = String(input || '').trim();
  const q = original.toLowerCase().replace(/[^a-z0-9 ₹$€]/g, ' ').replace(/\s+/g, ' ').trim();
  const profile = getGlobeTrekProfile(history, original);
  const profileLine = [profile.country, profile.course, profile.budget && 'budget ' + profile.budget, profile.intake && 'intake ' + profile.intake]
    .filter(Boolean)
    .join(' • ');
  const context = profileLine ? ' I’ve noted: ' + profileLine + '.' : '';
  const tailoredNext = nextQuestion(profile);

  if (!q) return 'Please type a question or a detail about your study-abroad plans, and I’ll help you with the next step.';
  if (/^(hi|hello|hey|hii|good morning|good afternoon|good evening)$/.test(q)) return 'Hello! I’m GlobeTrek AI, your study-abroad companion. I can help with destinations, universities, applications, documents, visas, scholarships, English tests, costs and travel.' + context + ' What would you like to plan?';
  if (q.includes('how are you')) return 'I’m ready to help you plan your study-abroad journey. ' + tailoredNext;
  if (q.includes('thank')) return 'You’re welcome! I’m here whenever you need the next step. ' + tailoredNext;
  if (q.includes('what can you do') || q.includes('who are you') || q.includes('help me')) return 'I’m GlobeTrek AI. I can compare destinations, explain admissions and visa steps, prepare document checklists, guide IELTS/PTE preparation, discuss scholarship options and help you use the GlobeTrek app.' + context + ' ' + tailoredNext;
  if (q === 'uk' || q.includes('united kingdom') || q.includes('study in uk') || q.includes('study uk')) return 'The UK is a strong choice for globally recognised universities and one-year master’s degrees. Compare UK universities by course, tuition and intake, then prepare your passport, academic documents, English-language proof, offer letter and financial evidence.' + context + ' ' + tailoredNext;
  if (q === 'canada' || q.includes('study in canada')) return 'Canada is popular for career-focused programmes and a clear study pathway. Compare Canadian universities by course, tuition, location and English-score requirement, then prepare transcripts, passport, offer letter, finances and language-test result.' + context + ' ' + tailoredNext;
  if (q === 'australia' || q.includes('study in australia')) return 'Australia offers a wide choice of bachelor’s and master’s programmes. Use the Australia filter in Universities, compare course fees and intakes, then organise academic records, passport, English-test score and financial documents.' + context + ' ' + tailoredNext;
  if (q === 'usa' || q.includes('united states') || q.includes('study in usa') || q.includes('study in us')) return 'The USA offers a broad selection of universities, specialisations and scholarships. Shortlist by course and budget first; applications often need transcripts, a statement of purpose, recommendations and English-test results.' + context + ' ' + tailoredNext;
  if (q.includes('germany') || q.includes('europe')) return 'Germany and other European destinations can offer excellent value and specialised programmes. Choose an English-taught course where needed, then compare tuition, living costs, admissions requirements and visa rules.' + context + ' ' + tailoredNext;
  if (q.includes('visa')) return 'For a study visa, keep your passport, university offer letter, financial proof, English-test score report, medical documents and photographs ready. Requirements and proof-of-funds rules vary by country, so confirm the final list with a GlobeTrek visa counsellor.' + context + ' ' + tailoredNext;
  if (q.includes('document') || q.includes('passport') || q.includes('sop') || q.includes('lor') || q.includes('transcript')) return 'For applications, prepare your passport, academic transcripts and certificates, English-test result, CV/resume, statement of purpose and recommendation letters where required. Upload the documents in My Documents and retain originals.' + context + ' ' + tailoredNext;
  if (q.includes('application') || q.includes('apply') || q.includes('admission')) return 'Your application path is: shortlist universities, confirm eligibility and deadlines, prepare documents, submit applications, track offers, and then begin visa preparation. GlobeTrek’s Applications and Documents tabs help you keep each step organised.' + context + ' ' + tailoredNext;
  if (q.includes('scholar')) return 'Scholarships depend on the country, university, course and your academic profile. Save suitable universities, review their scholarship options and apply early. Strong grades and a clear statement of purpose can strengthen an application.' + context + ' ' + tailoredNext;
  if (/\b(ielts|pte)\b/.test(q) || q.includes('english test')) return 'Many courses ask for IELTS or PTE; an IELTS overall score around 6.5 is common, but each programme sets its own rule. Use Mock Tests to practise and always verify the course-specific requirement.' + context + ' ' + tailoredNext;
  if (q.includes('cost') || q.includes('budget') || q.includes('fee') || q.includes('tuition') || q.includes('living')) return 'Plan for tuition, living costs, insurance or health cover, visa fees, travel and a financial buffer. Share your destination and budget range and I can help you compare the likely cost areas.' + context + ' ' + tailoredNext;
  if (q.includes('intake') || q.includes('deadline')) return 'The main intakes are usually September/October and January/February, though some universities offer others. Apply early because document checks, offers and visa processing take time.' + context + ' ' + tailoredNext;
  if (q.includes('accommodation') || q.includes('housing') || q.includes('travel') || q.includes('flight')) return 'After your offer and visa, plan accommodation, flights, insurance, airport pickup and your essential documents. GlobeTrek can help you build a simple pre-departure checklist.' + context + ' ' + tailoredNext;
  if (q.includes('university') || q.includes('college') || q.includes('course') || q.includes('shortlist')) return 'I can help you shortlist from GlobeTrek’s university directory. Use Universities to filter by country, then compare and save options that match your course, budget and intake.' + context + ' ' + tailoredNext;

  const topic = original.replace(/\s+/g, ' ').slice(0, 110);
  return 'Thanks for sharing “' + topic + '”. I’ve understood that as part of your study-abroad planning.' + context + ' I can turn it into a destination choice, university shortlist, application plan, document checklist, visa preparation or budget comparison. ' + tailoredNext;
}

const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const localOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin || configuredOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && localOrigin.test(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  if (token === 'globetrek-demo-session') { req.userId = demoUser.id; req.isDemo = true; return next(); }
  try { req.userId = jwt.verify(token, jwtSecret).id; next(); }
  catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};

app.get('/api/health', (_req, res) => res.json({ ok: true, database: mongoose.connection.readyState === 1, databaseError }));
app.get('/api/universities', async (req, res, next) => {
  if (!databaseOnline()) return res.status(503).json({ message: 'University data is temporarily unavailable. Please try again shortly.' });
  try { const { country, search = '', page = '1', limit = '24' } = req.query; const filter = { ...(country ? { country } : {}), ...(search ? { $text: { $search: search } } : {}) }; const [items, total] = await Promise.all([University.find(filter).sort({ name: 1 }).skip((Number(page) - 1) * Number(limit)).limit(Number(limit)), University.countDocuments(filter)]); res.json({ items, total, page: Number(page) }); } catch (error) { next(error); }
});
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, mobile } = req.body;
    const cleanEmail = normaliseEmail(email);
    if (!name || !cleanEmail || !password) return res.status(400).json({ message: 'Name, email and password are required' });

    if (!databaseOnline()) {
      if (localUsers.has(cleanEmail)) return res.status(409).json({ message: 'Email already registered' });
      const user = {
        id: 'local-' + Date.now(),
        name: String(name).trim(),
        email: cleanEmail,
        mobile: String(phone || mobile || '').trim(),
        passwordHash: await bcrypt.hash(password, 12),
      };
      localUsers.set(cleanEmail, user);
      return res.status(201).json(createAuthResponse(user));
    }

    if (await User.exists({ email: cleanEmail })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name: String(name).trim(), email: cleanEmail, phone: String(phone || mobile || '').trim(), passwordHash: await bcrypt.hash(password, 12) });
    res.status(201).json(createAuthResponse(user));
  } catch (error) { next(error); }
});
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, identifier, password } = req.body;
    const cleanEmail = normaliseEmail(email || identifier);
    if (!databaseOnline()) {
      const user = localUsers.get(cleanEmail);
      if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
      return res.json(createAuthResponse(user));
    }
    const user = await User.findOne({ email: cleanEmail });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json(createAuthResponse(user));
  } catch (error) { next(error); }
});
app.get(['/api/me', '/api/auth/me'], auth, async (req, res, next) => {
  try {
    if (req.isDemo) return res.json(demoUser);
    if (!databaseOnline()) {
      const user = [...localUsers.values()].find((item) => item.id === req.userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ id: user.id, name: user.name, email: user.email, mobile: user.mobile });
    }
    res.json(await User.findById(req.userId).select('-passwordHash'));
  } catch (error) { next(error); }
});
app.post('/api/auth/logout', (_req, res) => res.json({ message: 'Logged out' }));
app.get('/api/applications', auth, async (req, res, next) => {
  try {
    if (req.isDemo) return res.json(demoApplications);
    if (!databaseOnline()) return res.json(localApplications.get(req.userId) || []);
    return res.json(await Application.find({ user: req.userId }).populate('university').sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});
app.post('/api/applications', auth, async (req, res, next) => {
  try {
    const createdAt = new Date().toISOString();
    if (req.isDemo) {
      const item = { id: String(Date.now()), ...req.body, status: 'submitted', createdAt, updatedAt: createdAt };
      demoApplications.unshift(item);
      return res.status(201).json(item);
    }
    if (!databaseOnline()) {
      const item = { id: 'local-app-' + Date.now(), userId: req.userId, ...req.body, status: 'submitted', createdAt, updatedAt: createdAt };
      const applications = localApplications.get(req.userId) || [];
      applications.unshift(item);
      localApplications.set(req.userId, applications);
      return res.status(201).json(item);
    }
    return res.status(201).json(await Application.create({ ...req.body, user: req.userId }));
  } catch (error) { next(error); }
});
app.post(['/api/chat', '/api/ai/chat'], async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !String(message).trim()) return res.status(400).json({ message: 'A message is required' });
    const knowledge = 'You are GlobeTrek AI, a study abroad assistant for GlobeTrek Overseas. Help with university selection across 25 countries, applications, documents, visa steps, scholarships, IELTS/PTE preparation, costs, accommodation, and pre-departure support. Be concise, friendly, and practical. Never promise admissions or visas; advise users to confirm country-specific requirements with a GlobeTrek counsellor.';
    if (!process.env.OPENAI_API_KEY) {
      const reply = getGlobeTrekReply(message, history);
      return res.json({ reply, source: 'globetrek-knowledge-base' });
    }
    const messages = [{ role: 'system', content: knowledge }, ...history.slice(-8).map(item => ({ role: item.role === 'user' ? 'user' : 'assistant', content: item.content })), { role: 'user', content: String(message) }];
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages, temperature: 0.4, max_tokens: 450 }) });
    if (!aiResponse.ok) throw new Error('AI provider request failed');
    const aiData = await aiResponse.json();
    res.json({ reply: aiData.choices?.[0]?.message?.content || 'I could not prepare a response. Please try again.', source: 'ai' });
  } catch (error) { next(error); }
});
app.use((error, _req, res, _next) => { console.error(error); res.status(500).json({ message: 'Server error' }); });
app.listen(port, () => console.log('GlobeTrek API listening on port ' + port));
const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  try {
    await mongoose.connect(mongoConnectionString(), { serverSelectionTimeoutMS: 10000 });
    databaseError = null;
    console.log('MongoDB Atlas connected');
  } catch (error) {
    databaseError = error instanceof Error ? error.message : String(error);
    console.error('MongoDB connection failed:', databaseError);
    setTimeout(connectDatabase, 15000);
  }
};
connectDatabase();
