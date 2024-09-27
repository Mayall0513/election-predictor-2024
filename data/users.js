import helpers from '../helpers/api_helpers';

import axios from 'axios';

async function getUser({ req }) {
	if (!req.cookies[process.env.AUTH_COOKIE_NAME]) {
		return null;
	}

	try {
		const tokenCookie = helpers.getCookie(req, process.env.AUTH_COOKIE_NAME);
		const token = helpers.decrypt(tokenCookie, process.env.AUTH_COOKIE_SECRET);

		const { id, username, avatar_url, discriminator } = JSON.parse(token);

		let on_correct_server = false;
		
		try {
			const discordAuthentication = await axios.get(
				process.env.BACKEND_URI + "/Discord",
				{
					headers: {
						cookie: process.env.AUTH_COOKIE_NAME + "=" + tokenCookie + ";"
					}
				}
			);

			on_correct_server = discordAuthentication.data;
		}
	
		catch (error) {
			console.error(error);
		}

		return { 
			id, 
			username, 
			avatar_url,
			discriminator,
			on_correct_server
		};
	}
	
	catch(error) { 
		return null;
	}
}

export default {
	getUser
};