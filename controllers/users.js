const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//get all users

exports.getUsers = async (req, res) => {
    User.find()
        .exec()
        .then(data => {
            res.json(data);

        })
        .catch(err => {
            console.log(err)
            res.json({ message: err })
        })
}

// get user
exports.getUser = async (req, res) => {
  User.findById(req.params.userId)
  .exec()
  .then(data => {
      res.json(data);

  })
  .catch(err => {
      console.log(err)
      res.json({ message: err })
  })
}

//delet user
exports.deleteUser = async (req, res) => {

    User.remove({ _id: req.params.userId })
    .exec()
    .then(data => {
        res.json(data);
  
    })
    .catch(err => {
        console.log(err)
        res.json({ message: err })
    })
}

//edit password
exports.editPassword = async (req, res) => {
    try {
        let user = await User.findById(req.params.userId);

        if (!user) {
            res.status(401).json({ message: 'Invalid user.' });
        } else {
            let isValid = await bcrypt.compare(req.body.password, user.password);
            if (!isValid) {
                res.status(401).json({ message: 'Invalid password.' });
            } else {
                hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
                user.password = hashedPassword;
                await user.save();
                res.status(200).json({ message: 'Password updated Successfully!' });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
    }
}

//signup
exports.signupUser = (req, res) => {

    User.find({
        username: req.body.login
    })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Username exists'
                });



            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {



                                        const user = new User({
                                            name: req.body.name,
                                            email: req.body.email,
                                            username: req.body.login,
                                            password: hash,

                                        })
                                        user.save()
                                            .then(data => {
                                                res.json(data);

                                            })

                            
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })

                    }

                })
            }
        })
}