import { URLSearchParams } from 'url';

import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import axios from 'axios';

const tokenConfig = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

export default async (request, response) => {
    if (request.query.code) {
        try {
            const token_params = new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: request.query.code,
                redirect_uri: `${process.env.FRONTEND_URI}/api/auth/signin`,
                scope: 'identify'
            });

            const token_response = await axios.post(`${process.env.DISCORD_API_URI}/oauth2/token`, token_params.toString(), tokenConfig);
            const { token_type, access_token } = token_response.data;

            const user_config = {
                headers: {
                    'Authorization': `${token_type} ${access_token}`
                }
            };

            const user_response = await axios.get(`${process.env.DISCORD_API_URI}/users/@me`, user_config);
            const { id , username, avatar, discriminator } = user_response.data;

            const revoke_params = new URLSearchParams({
                token: access_token,
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
            });

            await axios.post(`${process.env.DISCORD_API_URI}/oauth2/token/revoke`, revoke_params.toString());

            const token = jwt.sign(
                { 
                    id, 
                    username, 
                    avatar,
                    discriminator                
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
    
            response.setHeader(
                "Set-Cookie", 
                cookie.serialize(
                    process.env.AUTH_COOKIE_NAME,
                    token,
                    {
                        httpOnly: true,
                        secure: process.env.NODE_ENV != "development",
                        sameSite: 'lax',
                        path: '/'
                    }
                )
            );

            return response.status(200).redirect(process.env.FRONTEND_URI);
        }

        catch(error) { }
    }

    return response.status(200).redirect(`${process.env.DISCORD_URL}/oauth2/authorize?response_type=code&scope=${process.env.DISCORD_CLIENT_SCOPE}&client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.FRONTEND_URI}/api/auth/signin`);
};

export const config = {
    api: {
        bodyParser: false,
    }
};