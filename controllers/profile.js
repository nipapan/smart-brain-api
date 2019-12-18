const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

const handleProfileUpdate = (req, res, db) => {
   const {id} = req.params;
   const {name, age, pet} = req.body.profileFormInput;

   db('users')
      .where({id})
      .update({name, age, pet})
      .then(dbres => {
         if(dbres) {
            res.json('updated!')
         } else {
            res.status(400).json('Unable to update')
         }
      })
      .catch(err => res.status(400).json('error update user'))
}

module.exports = {
   handleProfileGet,
   handleProfileUpdate
}