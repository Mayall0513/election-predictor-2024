import cookie from 'cookie';

export default (request, response) => {
    response.setHeader('Set-Cookie',
        cookie.serialize(process.env.AUTH_COOKIE_NAME, '', 
            {
                maxAge: 0,
                path: '/'
            }
        )
    );

    response.status(200).redirect("/");
}

export const config = {
    api: {
        bodyParser: false,
    }
}