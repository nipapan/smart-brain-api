const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const signout = require('./controllers/signout');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./Middlewares/auth');

const db = knex(knexConfig[process.env.ENVIRONTMENT || 'development']);

const app = express();

app.use(morgan('combined'))
app.use(cors())
app.use(bodyParser.json());

app.get('/', (req, res)=> { res.send(db.users) })
app.post('/signin', signin.handleAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.post('/signout', (req, res) => {signout.handleSignout(req, res)})
app.get('/profile/:id', auth.isAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.isAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.isAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.isAuth, (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
