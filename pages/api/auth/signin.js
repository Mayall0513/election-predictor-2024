import url from 'node:url';
import crypto from 'node:crypto';

import axios from 'axios';

import helpers from '../../../helpers/api_helpers';

function sendChallenge(req, res) {
    const statePlaintext = crypto.randomBytes(parseInt(process.env.AUTH_STATE_COOKIE_SIZE)).toString('hex');
    const stateEncrypted = helpers.encrypt(statePlaintext, process.env.AUTH_STATE_COOKIE_SECRET);

    helpers.setCookie(
        res,
        process.env.AUTH_STATE_COOKIE_NAME,
        stateEncrypted,
        helpers.generateCookieOptions(30 * 60, 'lax', '/api/auth/signin')
    )

    const authoriseParams = new url.URLSearchParams({
        response_type: 'code',
        scope: process.env.DISCORD_AUTH_SCOPE,
        client_id: process.env.DISCORD_CLIENT_ID,
        prompt: 'consent',
        redirect_uri: `${process.env.FRONTEND_URI}/api/auth/signin`,
        state: statePlaintext
    });
 
    res.status(200).redirect(`${process.env.DISCORD_URL}/oauth2/authorize?${authoriseParams.toString()}`);
}

async function acquireToken(req, res) {
    const stateEncrypted = helpers.getCookie(
        req,
        process.env.AUTH_STATE_COOKIE_NAME
    );

    if (false == stateEncrypted) {
        return res.status(400).json("oauth2 code required");
    }

    helpers.setCookie(
        res,
        process.env.AUTH_STATE_COOKIE_NAME,
        '',
        helpers.generateCookieOptions(-1)
    )

    const statePlaintext = helpers.decrypt(stateEncrypted, process.env.AUTH_STATE_COOKIE_SECRET);
    if (statePlaintext !== req.query.state) {
        return res.status(403).json("oauth2 code invalid");
    }

    try {
        const tokenConfig = {
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        };

        const tokenParams = new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: `${process.env.FRONTEND_URI}/api/auth/signin`,
            scope: process.env.DISCORD_AUTH_SCOPE,
        });

        const tokenResponse = await axios.post(`${process.env.DISCORD_API_URI}/oauth2/token`, tokenParams.toString(), tokenConfig);
        const { token_type, access_token } = tokenResponse.data;

        const authenticationConfig = {
            headers: {
                'Authorization': `${token_type} ${access_token}`
            }
        };

        const userInformation = await axios.get(`${process.env.DISCORD_API_URI}/users/@me`, authenticationConfig);
        const { id , username, avatar, discriminator } = userInformation.data;

        const revokeParams = new url.URLSearchParams({
            token: access_token,
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
        });

        await axios.post(`${process.env.DISCORD_API_URI}/oauth2/token/revoke`, revokeParams.toString());

        const avatarUrl = avatar.startsWith('a_')
            ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif?size=80`
            : `https://cdn.discordapp.com/avatars/${id}/${avatar}?size=80`;

        const tokenContents = JSON.stringify(
            { 
                id, 
                username, 
                avatar_url: avatarUrl,
                discriminator                
            }
        );

        const token = helpers.encrypt(
            tokenContents,
            process.env.AUTH_COOKIE_SECRET
        );

        helpers.setCookie(
            res,
            process.env.AUTH_COOKIE_NAME,
            token,
            helpers.generateCookieOptions(6 * 60 * 60)
        )

        return res.status(200).redirect(process.env.FRONTEND_URI);
    }

    catch (error) {  }

    return res.status(500).redirect(process.env.FRONTEND_URI);
}

export default async (req, res) => {
    req.query.code && req.query.state
        ? await acquireToken(req, res)
        : sendChallenge(req, res);
};

export const config = {
    api: {
        bodyParser: false,
    }
};