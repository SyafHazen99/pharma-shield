import express from 'express';
import cors from 'cors';
import { loadDB } from './db/database.js';
import { BRANDING } from './config/branding.js';
import apiRouter from './routes/api.js';

// Initialize DB
loadDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares - Production Anti-Breach Safeguards
app.use((req, res, next) => {
  // Security Headers (OWASP Recommended)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https:;");
  next();
});

// Restricted CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://sentra.health'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by Security Policy: CORS origin not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Payload Size Limits (Mitigates Memory Exhaustion Attacks)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Simple In-Memory Rate Limiter (Anti-DDoS)
const rateLimitMap = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 300;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length > maxRequests) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Terdeteksi percobaan akses berlebihan (Rate Limit Exceeded). Akses dibatasi sementara untuk perlindungan sistem RS."
    });
  }

  next();
});

// API Routes
app.use('/api', apiRouter);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    status: "SECURE",
    message: `Welcome to ${BRANDING.appName} Anti-Fraud Gateway`,
    organization: BRANDING.organization,
    team: BRANDING.team,
    version: BRANDING.version,
    securityEnforced: ["OWASP Headers", "CORS Restricted", "Rate Limiting", "Path Traversal Shield"],
    endpoints: "/api/info"
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🛡️  ${BRANDING.appName} (Anti-Breach Hardened)`);
  console.log(`🏢  ${BRANDING.organization}`);
  console.log(`👩‍⚕️  Project Leader: ${BRANDING.team.projectLeader}`);
  console.log(`🎨  QC Engineer & Designer: ${BRANDING.team.qcEngineerAndDesigner}`);
  console.log(`🔒  Security Enforced: CORS Restricted, CSP, OWASP Headers, Anti-DDoS`);
  console.log(`🚀  Server listening on http://localhost:${PORT}`);
  console.log(`==================================================`);
});
