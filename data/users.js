async function getUser(request) {
    if (request.cookies[process.env.AUTH_COOKIE_NAME]) {
        try {
            const { id, username, discriminator } = jwt.verify(req.cookies[process.env.AUTH_COOKIE_NAME], process.env.JWT_SECRET);
    
            return { 
              id, 
              username, 
              discriminator
            };
        }
        
        catch(error) {  }
      }
    
      return null;
}

export {
    getUser
};