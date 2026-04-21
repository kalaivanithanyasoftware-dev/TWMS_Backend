import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config();

import express from "express"
import useragent from 'express-useragent';
import helmet from "helmet";
import cors from "cors"
import fileUpload from "express-fileupload";
import crypto from "crypto";
import fs from "fs";
import authenticationRoutes from "./routes/authentications/authenticationRoutes.js";
import protectedRoutes from "./routes/index.js";
import { blockSuspiciousEncodings, earlyUrlValidation, validatePathSegments } from "./security/sanitizers.js";
import { auth, validateSession } from "./config/auth.js";

const app = express();
app.set('trust proxy', true);

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString("base64");
  next();
});
const allowedOrigins = [
  ...process.env?.ALLOWED_ORIGINS?.split(',')
];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");

  if (!origin || allowedOrigins.includes(origin)) {
    // ✅ Allow request
    callback(null, {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "browser-path", "x-browser-path", "x-auth-token", "route"],
    });
  } else {
    // ❌ Deny and respond gracefully
    callback(null, {
      origin: false, // block the actual request
      preflightContinue: false,
    });
  }
};

// ✅ Apply CORS with custom delegate
app.use((req, res, next) => {
  cors(corsOptionsDelegate)(req, res, (err) => {
    if (err) {
      return res.status(403).json({ success: false, message: "CORS error" });
    }
    const origin = req.header("Origin");
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ success: false, message: "Origin not allowed by CORS" });
    }
    next();
  });
});

// ✅ Add Helmet for security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", ...allowedOrigins],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        objectSrc: ["'self'"],
        frameAncestors: ["'self'", ...allowedOrigins],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    xFrameOptions: { action: "deny" },
  })
);

app.use('/assets', express.static('assets'));
// 🔒 Apply early guard *before* anything else
app.use(earlyUrlValidation);
app.use(blockSuspiciousEncodings);
app.use(validatePathSegments);        // 3️⃣ Allow only safe URL characters

app.use(useragent.express());
app.use(express.json({ limit: '400mb' }))
app.use(fileUpload({
  safeFileNames: true,
  preserveExtension: 5
}));

app.use(express.static("../build"));

app.use('/api/authentications', authenticationRoutes)
app.use('/api/protected', auth, validateSession, protectedRoutes)

app.get('/api/documentation/Project_Flowchart', (req, res) => {
  let html = fs.readFileSync("./documentation/Project_Flowchart.html", "utf8");
  // Inject nonce dynamically
  html = html.replace(
    /<script/g,
    `<script nonce="${res.locals.nonce}" `
  );
  html = html.replace(
    /<style/g,
    `<style nonce="${res.locals.nonce}" `
  );
  res.send(html);
})

// SPA Fallback: Serve index.html for all other routes
app.use((req, res, next) => {
  const excludedRoutes = ["/api", "/assets"];
  if (excludedRoutes.some(route => req.url.startsWith(route))) {
    return next();
  }

  let html = fs.readFileSync("../build/index.html", "utf8");
  // Inject nonce dynamically
  html = html.replace(
    /<script /g,
    `<script nonce="${res.locals.nonce}" `
  );

  html = html.replace(
    /<style /g,
    `<style nonce="${res.locals.nonce}" `
  );
  res.send(html);
});


// ✅ Handle unknown routes safely (no reflection)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// ✅ Global error handler (for catching thrown errors)
app.use((err, req, res, next) => {
  console.error("Error caught:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});
const port = process.env.PORT || 4000

app.listen(port, '0.0.0.0', () => {
  console.log('Connected to ' + port);
})