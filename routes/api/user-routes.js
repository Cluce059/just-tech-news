const router = require('express').Router();
const { resourceLimits } = require('worker_threads');
const { User } = require('../../models');

router.get('/', (req, res) => {
    //access user model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password']}
    })
    //aka SELECT * FROM ...
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/:id', (req, res) =>{
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
      // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
      User.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
      })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.put('/:id', (req, res)=>{
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({ message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData =>{
        if(!dbUserData){
            res.status(404).json({ message: 'No user found wit this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;