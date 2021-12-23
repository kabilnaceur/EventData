const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Event = require('../models/event')

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
        username: req.body.username
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
                                            username: req.body.username,
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
// login
exports.loginUser = (req, res, next) => {
    User.find({ username: req.body.username})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'auth failed'
                })
            }
            bcrypt.compare(req.body.password,user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'auth failed'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        username: user[0].username,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        //expiresIn: "1h"
                    })
                    return res.status(200).json({
                        message: 'auth successful',
                        token: token,
                        user: user[0]
                    })
                }
                return res.status(401).json({
                    message: 'auth failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}
// get connect user 
exports.getCurrentUser = async (req, res) => {

    try {
        console.log(req.user)

        const user = await User.find({ _id: req.user.userId})
            
            .exec()
        res.status(200).json({ connectedUser: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });

    }

};
// add like to event
exports.addLike = async (req, res) => {
    try {
        const eventId = req.params.eventId

        const event = await Event.findOne({ _id: eventId})
        const user = await User.findOne({ _id: req.user.userId})
            if (user) {

                await User.updateOne({ _id: user._id}, { $push: { likes: event} })
                return res.status(200).json({ message: 'event successfully saved' })
            }
        


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}
// delete Like
exports.deleteLike = async (req, res) => {
    try {
       
      
        const eventId = req.params.eventId

        const event = await Event.findOne({ _id: eventId})   
                 if (event) {

                await User.updateOne({ _id: req.user.userId}, { $pull: { likes: event._id } })
                return res.status(200).json({ message: 'event successfully deleted' })
            }
        
        return res.status(404).json({ message: 'event not found' })


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
} 
// add event to user 
exports.addEvent = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId })
        const event = new Event({
            name:req.body.name,
            date:req.body.date,
            description : req.body.description,
            location:req.body.location,
            type:req.body.type,
            user: user._id,


        })



        await User.updateOne({ _id: req.user.userId }, { $push: { events: event } })
        await event.save()
        return res.status(200).json({ message: 'event successfully saved' })



    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}
//delete event to user
exports.deleteEvent = async (req, res) => {
    try {


        const event = await Event.findOne({ _id: req.params.eventId })
        if (event) {

            await User.updateOne({ _id: req.user.userId }, { $pull: { events: event._id } })
            return res.status(200).json({ message: 'event successfully deleted' })
        }

        return res.status(404).json({ message: 'event not found' })


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}