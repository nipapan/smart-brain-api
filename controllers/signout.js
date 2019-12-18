const redisClient = require('./signin').redisClient;

const handleSignout = (req, res) => {
   const { authorization } = req.headers;
   if (!authorization) {
      return res.status(200).json('you are not in at the beginning!');
   } else {
      return redisClient.del(authorization, () => {
         return res.status(200).json('Completely sign out!');
      })
   }
}

module.exports = {
   handleSignout: handleSignout
}