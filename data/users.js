import jwt from 'jsonwebtoken';

function getUser({ req: request }) {
	if (request.cookies[process.env.AUTH_COOKIE_NAME]) {
		try {
			const { id, username, avatar_url, discriminator } = jwt.verify(request.cookies[process.env.AUTH_COOKIE_NAME], process.env.JWT_SECRET);

			return { 
				id, 
				username, 
				avatar_url,
				discriminator
			};
		}
		
		catch(error) {  }
	  }
	
	  return null;
}

export default {
	getUser
};