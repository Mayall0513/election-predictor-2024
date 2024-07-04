import helpers from '../helpers/api_helpers';

function getUser({ req }) {
	if (req.cookies[process.env.AUTH_COOKIE_NAME]) {
		return null;
	}

	try {
		const tokenCookie = helpers.getCookie(req, process.env.AUTH_COOKIE_NAME);
		const token = helpers.decrypt(tokenCookie, process.env.AUTH_COOKIE_SECRET);

		const { id, username, avatar_url, discriminator } = JSON.parse(token);

		return { 
			id, 
			username, 
			avatar_url,
			discriminator
		};
	}
	
	catch(error) { 
		return null;
	}
}

export default {
	getUser
};