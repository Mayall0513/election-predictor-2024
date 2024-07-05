import helpers from '../../../helpers/api_helpers';

export default function signOut(req, res) {
    helpers.setCookie(
        res,
        process.env.AUTH_COOKIE_NAME,
        '',
        helpers.generateCookieOptions(-1)
    )

    res.status(200).redirect("/");
};

export const config = {
    api: {
        bodyParser: false,
    }
}