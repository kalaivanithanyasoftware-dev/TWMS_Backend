// security/sanitizers.js
import { URL } from 'url';

/**
 * Config: tweak allowed characters here.
 * allowedSegmentRegex: allowed characters for each URL path segment.
 * allowedFieldRegex: allowed characters for body/query fields (basic strings).
 */
export const config = {
    allowedSegmentRegex: /^[A-Za-z0-9 _.-]+$/, // now space is allowed
    allowedFieldRegex: /^[A-Za-z0-9 _\-\.,:()@#%&+]+$/, // spaces already allowed
    maxPathSegmentLength: 120,
    maxFieldLength: 1000,
};

/**
 * Utility: decode a percent-encoded string exactly once.
 * If decoding fails, throws.
 */
export function safeDecodeOnce(s) {
    // Avoid double-decoding: decodeURIComponent can throw for malformed sequences
    try {
        // If the string contains no percent sign, return as-is
        if (!s.includes('%')) return s;
        // Decode once
        const decoded = decodeURIComponent(s);
        return decoded;
    } catch (e) {
        // Throw so caller can reject
        throw new Error('Malformed percent-encoding');
    }
}

/**
 * Middleware: block suspicious characters early.
 * - Reject if raw URL contains backslash or %5C (case-insensitive).
 * - Reject if originalUrl contains control characters.
 */
export function blockSuspiciousEncodings(req, res, next) {
    const raw = req.originalUrl || req.url || '';
    // raw might be encoded; check both raw and lowercased form
    if (raw.includes('\\') || /%5c/i.test(raw)) {
        console.warn('Blocked request with backslash or encoded backslash', { url: raw, ip: req.ip });
        return res.status(400).json({ success: false, message: 'Invalid request path' });
    }
    // control characters
    if (/[\x00-\x1F\x7F]/.test(raw)) {
        console.warn('Blocked request with control chars in URL', { url: raw, ip: req.ip });
        return res.status(400).json({ success: false, message: 'Invalid characters in request' });
    }
    next();
}

/**
 * Middleware: validate each path segment against allowlist.
 * Use this if you want strict enforcement on the path (useful for protected routes).
 * It inspects the pathname part only (ignoring query).
 */
export function validatePathSegments(req, res, next) {
    try {
        // req.originalUrl may contain query; extract pathname portion safely
        const full = req.originalUrl || req.url;
        // Ensure we do not throw on malformed URL by using URL with base
        const u = new URL(full, 'http://example.local');
        // decode segments once (safe)
        const rawSegments = u.pathname.split('/').filter(Boolean); // remove empty segments
        for (const seg of rawSegments) {
            // decode percent-encoding once
            const dec = safeDecodeOnce(seg);
            if (dec.length > config.maxPathSegmentLength) {
                console.warn('Blocked too-long path segment', { seg: dec, ip: req.ip });
                return res.status(400).json({ success: false, message: 'Invalid request path' });
            }
            // Reject backslash anywhere
            if (dec.includes('\\')) {
                console.warn('Blocked backslash in path segment', { seg: dec, ip: req.ip });
                return res.status(400).json({ success: false, message: 'Invalid characters in request path' });
            }
            if (!config.allowedSegmentRegex.test(dec)) {
                console.warn('Blocked disallowed characters in path segment', { seg: dec, ip: req.ip });
                return res.status(400).json({ success: false, message: 'Invalid request path' });
            }
        }
        next();
    } catch (err) {
        console.warn('Blocked request due to malformed URL or percent-decoding', { error: err.message, url: req.originalUrl, ip: req.ip });
        return res.status(400).json({ success: false, message: 'Malformed request' });
    }
}

/**
 * Middleware generator: validate body and query fields using whitelist rules.
 * Provide an array of allowed field names and optional per-field regex to override.
 *
 * Example usage:
 *   app.post('/api/foo', validateFields({
 *      body: ['name','search'],
 *      query: ['page'],
 *      patterns: { name: /^[A-Za-z0-9_\\-]+$/ }
 *   }), handler)
 */
export function validateFields({ body = [], query = [], params = [], patterns = {}, maxFieldLength } = {}) {
    const maxLen = maxFieldLength || config.maxFieldLength;
    return (req, res, next) => {
        try {
            // Validate body fields
            for (const key of body) {
                const val = req.body && req.body[key];
                if (val == null) continue;
                if (typeof val !== 'string' && typeof val !== 'number') {
                    return res.status(400).json({ success: false, message: `Invalid field ${key}` });
                }
                const s = String(val);
                if (s.length > maxLen) return res.status(400).json({ success: false, message: `Field ${key} too long` });
                // reject control chars or backslash
                if (/[\x00-\x1F\x7F]/.test(s) || s.includes('\\') || /%5c/i.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid characters in ${key}` });
                }
                const patt = patterns[key] || config.allowedFieldRegex;
                if (!patt.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid content in ${key}` });
                }
            }

            // Validate query fields
            for (const key of query) {
                const val = req.query && req.query[key];
                if (val == null) continue;
                const s = String(val);
                if (s.length > maxLen) return res.status(400).json({ success: false, message: `Query ${key} too long` });
                if (/[\x00-\x1F\x7F]/.test(s) || s.includes('\\') || /%5c/i.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid characters in ${key}` });
                }
                const patt = patterns[key] || config.allowedFieldRegex;
                if (!patt.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid query ${key}` });
                }
            }

            // Validate route params (if you pass them)
            for (const key of params) {
                const val = req.params && req.params[key];
                if (val == null) continue;
                const s = String(val);
                if (s.length > maxLen) return res.status(400).json({ success: false, message: `Param ${key} too long` });
                if (/[\x00-\x1F\x7F]/.test(s) || s.includes('\\') || /%5c/i.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid characters in ${key}` });
                }
                const patt = patterns[key] || config.allowedSegmentRegex;
                if (!patt.test(s)) {
                    return res.status(400).json({ success: false, message: `Invalid param ${key}` });
                }
            }

            next();
        } catch (err) {
            console.warn('Validation error', { error: err.message });
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }
    };
}

export function earlyUrlValidation(req, res, next) {
    try {
        const url = req.url || '';

        // ❌ Detect invalid percent-encoding
        if (/%(?![0-9A-Fa-f]{2})/.test(url)) {
            console.warn('🚫 Blocked malformed percent-encoding:', url);
            return res.status(400).json({
                success: false,
                message: 'Malformed URL',
            });
        }

        // ❌ Reject any backslash or control characters
        if (url.includes('\\') || /[\x00-\x1F\x7F]/.test(url)) {
            console.warn('🚫 Blocked suspicious characters in URL:', url);
            return res.status(400).json({
                success: false,
                message: 'Invalid URL characters',
            });
        }

        next();
    } catch (err) {
        console.warn('🚫 Early URL validation error:', err.message, req.url);
        return res.status(400).json({
            success: false,
            message: 'Invalid request path',
        });
    }
}


/**
 * Helper: whitelistRouter - apply path validation to an entire router.
 * Example:
 *   whitelistRouter(protectedRoutes);
 */
export function whitelistRouter(router) {
    // attach middleware to router to validate incoming path segments (router-level)
    router.use(blockSuspiciousEncodings);
    router.use(validatePathSegments);
}
