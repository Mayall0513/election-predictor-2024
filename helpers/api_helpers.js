import crypto from 'node:crypto';

import cookie from 'cookie';

function generateCookieOptions(maxAge, sameSite = 'lax', path = '/') {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        maxAge,
        sameSite,
        path
    };
}

function getCookie(req, name) {
    if (!req.headers.cookie) {
        return false;
    }

    const cookies = cookie.parse(req.headers.cookie);
    return cookies[name] 
        ? cookies[name]
        : false;
}

function setCookie(res, name, value, options) {
    const existingCookies = res.getHeader('set-cookie');
    const newCookie = cookie.serialize(name, value, options);

    const newCookies = existingCookies 
        ? [ ... existingCookies, newCookie ]
        : [ newCookie ];

    res.setHeader('set-cookie', newCookies);

    return true;
}

function encrypt(plaintext, key) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = iv.toString('hex')
        + '.'
        + cipher.update(plaintext, 'utf8', 'hex')
        + cipher.final('hex')
        + '.'
        + cipher.getAuthTag().toString('hex');
    
    return encrypted;
}

function decrypt(encrypted, key) {
    const parts = encrypted.split('.');

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedValue = Buffer.from(parts[1], 'hex')
    const tag = Buffer.from(parts[2], 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = decipher.update(encryptedValue, 'utf8', 'utf8')
        + decipher.final('utf8');
    
    return decrypted;
}

function parseJsonSafe(string) {
    try {
        return JSON.parse(string);
    }

    catch (exception) {
        return false;
    }
}

export default {
    encrypt,
    decrypt,
    generateCookieOptions,
    getCookie,
    setCookie,
    parseJsonSafe
};