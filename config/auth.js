import jwt from 'jsonwebtoken';
import { encode } from "html-entities"
import fs from "fs/promises"
import { v4 as uuidv4 } from 'uuid';
import nodemailer from "nodemailer";
import { poolPromise, sql } from './db.js';
import ftp from 'basic-ftp'
const signInToken = (user) => {
    return jwt.sign(user,
        process.env.JWT_SECRET,
        // {
        //     expiresIn: "2d",
        // }
    );
};

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied', data: {} });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userDetails = decoded;
        await validateSession(req, res, next)
    } catch (err) {
        return res.status(401).json({ message: 'Token is not valid', err: `${err}` });
    }
};

const encodeHTMLEntities = (req, res, next) => {
    for (const vals in req.body) {
        if (!Array.isArray(req.body[vals]))
            req.body[vals] = encode(req.body[vals]);
    }
    next();
}

const getReqUserInfo = async (req, res, { empcode, firstname, id, deviceId, usertype, logOutDate }) => {
    try {
        const newDeviceId = uuidv4(); // Generate unique device ID 
        const reqUrl = req.originalUrl
        const userDetails = JSON.stringify({ empcode, firstname, id })
        // if user iis server make sure to add "<iisnode enableXFF="true" />" in web.config file
        const ip = req.ip || req.headers["x-forwarded-for"] || req.socket['_peername']?.address || req.socket['_sockname']?.address || req.socket['_connectionKey']?.address
        const ips = JSON.stringify([...req.ips, ...[req.connection.remoteAddress || req.socket.remoteAddress]]);
        const systenInfo = atob(req.headers['x-system-info'] || '') || null;
        const parsedSystenInfo = JSON.parse(systenInfo || '{}');

        const localIp = parsedSystenInfo?.localIp || req.connection.remoteAddress || req.socket.remoteAddress

        const clientHost = parsedSystenInfo?.hostname || ''

        const userAgent = req.headers['user-agent']
        if (Object.values(userDetails).length) {
            const pool = await poolPromise;
            await pool.request()
                .input('userId', sql.Int, id)
                .input('usertype', sql.NVarChar, usertype)
                .input('deviceId', sql.NVarChar, deviceId)
                .input('userDetails', sql.NVarChar, userDetails)
                .input('userAgent', sql.NVarChar, userAgent)
                .input('ip', sql.NVarChar, ip)
                .input('localIp', sql.NVarChar, localIp)
                .input('ips', sql.NVarChar, ips)
                .input('reqUrl', sql.NVarChar, reqUrl)
                .input('systenInfo', sql.NVarChar, systenInfo)
                .input('createddate', sql.DateTime, logOutDate || null)
                .query(`INSERT INTO client_info (userId,usertype,deviceId,userDetails,userAgent,ip,localIp,ips,reqUrl,createddate, systenInfo) VALUES (@userId, @usertype, @deviceId, @userDetails,@userAgent, @ip, @localIp, @ips, @reqUrl, ISNULL(@createddate, GETDATE()), @systenInfo)`)
        }
        return { newDeviceId, ip, localIp, clientHost }
    } catch (error) {
        console.log(error);
    }
}


const userSessions = async (req, { userId, deviceId, usertype, token, ip }) => {
    // http://ip-api.com/json/123.201.178.48 // to get Location
    const device = req.useragent.platform;
    const browser = req.useragent.browser;
    const os = req.useragent.os;
    const userAgent = req.headers['user-agent'];
    const systenInfo = atob(req?.headers['x-system-info'] || '') || null;

    const parsedSystenInfo = JSON.parse(systenInfo || '{}');

    const localIp = parsedSystenInfo?.localIp || req.connection.remoteAddress || req.socket.remoteAddress
    try {
        const pool = await poolPromise;
        const sessionResult = await pool.request()
            .input('userId', sql.Int, userId)
            .input('deviceId', sql.NVarChar, deviceId)
            .query(`SELECT id FROM user_sessions WHERE userId = @userId AND deviceId = @deviceId`);
        const { id = null } = sessionResult.recordset[0] || {}
        if (sessionResult.recordset.length) {
            // Update existing session
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('id', sql.Int, id)
                .input('deviceId', sql.NVarChar, deviceId)
                .input('token', sql.NVarChar, token)
                .input('ip', sql.NVarChar, ip)
                .query(`UPDATE user_sessions 
                            SET token = @token, ip = @ip, expiryDate = DATEADD(HOUR, 8, GETDATE()), isValid=1 
                            WHERE userId = @userId AND deviceId = @deviceId AND id=@id`);
        } else {
            await pool.request()
                .input('userId', sql.Int, userId)
                .input('usertype', sql.NVarChar, usertype)
                .input('deviceId', sql.NVarChar, deviceId)
                .input('device', sql.NVarChar, device)
                .input('browser', sql.NVarChar, browser)
                .input('os', sql.NVarChar, os)
                .input('userAgent', sql.NVarChar, userAgent)
                .input('token', sql.NVarChar, token)
                .input('ip', sql.NVarChar, ip)
                .input('localIp', sql.NVarChar, localIp)
                .input('systenInfo', sql.NVarChar, systenInfo)
                .query(`INSERT INTO user_sessions (userId, usertype, deviceId, device, browser, os, userAgent, token, ip, localIp, expirydate, systenInfo)
                VALUES (@userId, @usertype, @deviceId, @device, @browser, @os, @userAgent, @token, @ip, @localIp, DATEADD(HOUR, 8, GETDATE()), @systenInfo);`);
        }
    } catch (error) {
        console.log(error);
        return {}
    }
}
const validateSession = async (req, res, next) => {
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required', data: {} });
    }

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT * 
                FROM user_sessions
                WHERE token = @token
                  AND isValid = 1
                  AND expirydate > GETDATE();
            `);

        if (!result.recordset.length) {
            return res.status(401).json({ message: 'Session expired or invalid', data: {} });
        }
        next()
    } catch (err) {
        res.status(401).send({ data: err.message, status: 'failed' });
    }
}

const changeDateToSqlFormat = (date) => {
    return !date ? '' : date.split(' ').map(v => v.split('-').reverse().join('-')).join(' ')
}


const changeFlatpickerDateToSqlFormat = (date) => {
    if (date.includes('to')) {
        const [date1 = '', date2 = ''] = date.split(' to ').map(dt => {
            let date = dt.split(' ')
            if (date[1]) {
                return `${date[0].split('-').reverse().join('-')} ${date[1]}`
            } else {
                return `${date[0].split('-').reverse().join('-')}`
            }
        })
        return [date1, date2]
    } else {
        return !date ? '' : date.split(' ').map(v => v.split('-').reverse().join('-')).join(' ')
    }
}
const sendMail = async ({ subject = "Hi there!", html, to, cc, from, host, port, secure = true, service, auth }) => {
    try {
        // build transporter config
        const transporterConfig = {
            host: host || 'smtp.gmail.com',
            port: port || (secure ? 465 : 25), // default port based on secure
            secure,
            service: service || undefined,
            requireTLS: !secure              // force TLS only if not using SSL
        };
        if (!secure) {
            transporterConfig.tls = {
                rejectUnauthorized: false
            }
        }
        if (secure) {
            if (auth?.user && auth?.pass) {
                transporterConfig.auth = {
                    user: auth.user,
                    pass: auth.pass
                };
            } else {
                transporterConfig.auth = {
                    user: 'parivallal723@gmail.com', // enter your email address
                    pass: 'mamdtfemalgnwnge'  // enter your visible/encripted password
                }
            }
        }

        const transporter = nodemailer.createTransport(transporterConfig);

        const mailOptions = {
            from: from || auth?.user || "noreply@aafees.com" || 'parivallal723@gmail.com',
            to,
            cc,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email error:", error.message);
        throw error;
    }
};
const safeParse = (value) => {
    try {
        if (typeof value === "string" && value.trim()) {
            return JSON.parse(value); // could be object or array
        }
        if (typeof value === "object" && value !== null) {
            return value; // already parsed
        }
        return null; // fallback if null/empty/invalid
    } catch {
        return null;
    }
};
function escapeCSV(value) {
    if (value === null || value === undefined) return "";

    const str = String(value);

    if (/[",\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
}
const safeRun = async (fn, label) => {
    try {
        await fn();
    } catch (err) {
        console.error(`⚠️ ${label} failed:`, err.message);
    }
};
// Append data to CSV
async function appendRowToCSV(filePath, row) {
    const csvLine = row.join(",") + "\n";
    await fs.appendFile(filePath, csvLine, "utf8");
}

async function appendRowsToCSV(filePath, rows) {
    const csvLines = rows.map(row => row.map(escapeCSV).join(",")).join("\n") + "\n";
    await fs.appendFile(filePath, csvLines, "utf8");
}


async function appendRowsToTxt(filePath, rows) {
    const csvLines = rows.map(row => row.join("\t")).join("\n") + "\n";
    await fs.appendFile(filePath, csvLines, "utf8");
}
// Upload file to FTP
async function uploadToFTP(localPath, remotePath) {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        await client.access({
            host: "svcw76-ftp.india.tejasnetworks.com",
            user: "AAFEES",
            password: "AsF%sd2025",
            secure: false,
        });
        console.log("Connected to FTP");

        await client.uploadFrom(localPath, remotePath);
        console.log("Upload successful");
    } catch (err) {
        console.error("FTP error:", err);
    } finally {
        client.close();
    }
}
export { signInToken, auth, encodeHTMLEntities, getReqUserInfo, userSessions, validateSession, changeDateToSqlFormat, changeFlatpickerDateToSqlFormat, sendMail, appendRowToCSV, appendRowsToCSV, appendRowsToTxt, uploadToFTP, safeParse, safeRun }