const router = require('express').Router();
const { resourceLimits } = require('worker_threads');
const { User, Post, Vote } = require('../../models');

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
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
              model: Post,
              attributes: ['title'],
              through: Vote,
              as: 'voted_posts'
            }
          ],
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

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: 'No user with that email'});
            return;
        }
        //res.json({ user: dbUserData });
        //verify user
        const validatePassword = dbUserData.checkPassword(req.body.password);
        if(!validatePassword){
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({
             user: dbUserData, message: 'You are now logged in!'
        });
    });
});

router.put('/:id', (req, res)=>{
    User.update(req.body, {
        individualHooks: true,
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