const jwt = require('jsonwebtoken');
const redis = require('redis');
const { ENV_JWT_SECRET } = require('../config');

const redisClient = redis.createClient(process.env.REDIS_URI);

const checkUserPassword = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect sign in submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
   const {authorization} = req.headers;
   return redisClient.get(authorization, (err, reply) => {
      if(err || !reply) {
         return res.status(400).json('Unauthorized');
      }
      return res.json({id: reply});
   });
}

const signToken = (email) => {
   const jwtPayload = {email};
   return jwt.sign(jwtPayload, ENV_JWT_SECRET, { expiresIn: '2 days' })
}

const setToken = (key, value) => {
   return Promise.resolve(redisClient.set(key, value))
}

const createSession = (user) => {
   const { email, id } = user;
   const token = signToken(email);
   return setToken(token, id)
      .then(() => {
         return { success: true, userId: id, token }
      })
      .catch(console.log)

}

const handleAuthentication = (db, bcrypt) => (req, res) => {
   const {authorization} = req.headers;
   return authorization ?
      getAuthTokenId(req, res) :
      checkUserPassword(db, bcrypt, req, res)
         .then(user => {
            return (user.id && user.email)? createSession(user) : Promise.reject(user);
         })
         .then(session => { res.json(session) })
         .catch(err => res.status(400).json(err));
}

module.exports = {
   handleAuthentication: handleAuthentication,
   redisClient: redisClient
}