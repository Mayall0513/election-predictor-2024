import axios from 'axios';

import helpers from '../../../../helpers/api_helpers';

export default async function _auth_discord(req, res) {
    const { code } = req.query;

    if (!code || "null" == code) {
        res.status(400).json("missing code");
        return;
    }

    const auth_params = new URLSearchParams(
        {
            discord_auth_code: code.slice(0, 5)
        }
    );

    try {
        const response = await axios.post(process.env.BACKEND_URI + "/Discord?" + auth_params.toString());
        if (204 == response.status) {
            res.status(401).json("invalid code");
            return;
        }

        const tokenContents = JSON.stringify(response.data);
        const token = helpers.encrypt(
            tokenContents,
            process.env.AUTH_COOKIE_SECRET
        );

        helpers.setCookie(
            res,
            process.env.AUTH_COOKIE_NAME,
            token,
            helpers.generateCookieOptions(30 * 60)
        );

        res.status(200).json("authenticated");
    }

    catch (error) {
        console.error(error);
        res.status(500).json("internal server error");
    }
};

export const config = {
    api: {
        bodyParser: false,
    }
};