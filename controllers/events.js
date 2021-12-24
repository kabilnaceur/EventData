const Event = require('../models/event')
const User = require('../models/user')
const Comment = require('../models/comment')
const Notification = require('../models/Notification')
const sendMobileNotification = require('../middleware/sendMobileNotification')
// get all events
exports.getEvents = async (req,res)=> {
    Event.find()
    .populate({ path: 'user', model: 'User' })
    .populate({
        path: 'comments', model: 'Comment', populate: {
            path: 'user',
            model: 'User'
        }
    })
    .exec()
    .then(data => {
        res.json(data);
    
    })



    .catch(err => {
        console.log(err)
        res.json({ message: err})
    })
}
// get event

exports.getEvent = async (req, res) => {
    Event.findById(req.params.eventId)
    .populate({ path: 'user', model: 'User' })
    .populate({
        path: 'comments', model: 'Comment', populate: {
            path: 'user',
            model: 'User'
        }
    })
    .exec()
    .then(data => {
        res.json(data);
  
    })
    .catch(err => {
        console.log(err)
        res.json({ message: err })
    })
  }
  // delete event
  exports.deleteEvent = async (req, res) => {

    User.remove({ _id: req.params.eventId })
    .exec()
    .then(data => {
        res.json(data);
  
    })
    .catch(err => {
        console.log(err)
        res.json({ message: err })
    })
}
// add event
exports.createEvent = (req,res)=>{
    const event = new Event ({
        name:req.body.name,
        date:req.body.date,
        description : req.body.des,
        location:req.body.location,
        type:req.body.type,
        user : req.user.userId

    }) 
    event.save()
    .then(data => {
        res.json(data);
    
    })
    .catch(err => {
        res.json({ message: err})
    })
}
// edit event
exports.updateEvent = async (req,res)=> {
    const name = req.body.name
    const date= req.body.date
   const description =req.body.description
   const location=req.body.location
   const type=req.body.type
    Event.findOneAndUpdate(
        { _id: req.params.eventId},
        { $set: {
            name:req.body.name,
            date:req.body.date,
            description : req.body.des,
            location:req.body.location,
            type:req.body.type,

        },
        
         },
         {useFindAndModify: false}
    ).then(result=>{
res.status(200).json({event:result,name:name,type:type,location:location,date:date,description:description})
    }

    ).catch(err=>{
        console.log(err)
        res.status(500).json({error:err})
    })


}
// add comment to event
exports.addComment = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId })
        const event = await Event.findOne({ _id: req.body.eventId })
        const comment = new Comment({
            comment:req.body.comment,
            user: user._id,


        })



        await Event.updateOne({ _id: req.body.eventId }, { $push: { comments: comment } })
        await comment.save()
        const newNotification = {
            type: 'comment',
            date: new Date().toISOString(),
            user: event.user,
            variables: JSON.stringify({
                user: { _id: user._id, name: user.name},
                event:{ _id: event._id, name: event.name},
                date: new Date().toISOString()
            })
        }
        await Notification.create(newNotification)

        sendMobileNotification(JSON.stringify(newNotification), event.user.notificationToken)
        return res.status(200).json({ message: 'comment successfully saved' })



    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}
//delete comment to event
exports.deleteComment = async (req, res) => {
    try {


        const comment = await Comment.findOne({ _id: req.params.commentId })
        if (comment) {

            await Event.updateOne({ _id: req.body.eventId }, { $pull: { comments: comment._id } })
            return res.status(200).json({ message: 'comment successfully deleted' })
        }

        return res.status(404).json({ message: 'comment not found' })


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}
// search event
exports.searchEvents = async (req, res) => {
    try {
        let searchTerm = req.query.searchTerm
        let searchedUserId = []
        let events;
        

        if (searchTerm) {
            const searchedUser = await User.find({ name: { $regex: `(?:${searchTerm.split(' ').join('|')})`, $options: 'i' } })
            
            searchedUserId = searchedUser.map(searched => searched._id)

            events = await Event.find({
                $or: [

                    {
                        name: { $regex: `(?:${searchTerm.split(' ').join('|')})`, $options: 'i' }
                    },
                    {
                        user: { $in: searchedUserId }
                    },
                ],                    
                   
                
            })      .populate({ path: 'user', model: 'User' })
            .populate({
                path: 'comments', model: 'Comment', populate: {
                    path: 'user',
                    model: 'User'
                }
            })

            res.status(200).json({ events: events})
        }

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ error: error });
        

    }

}
// add  participants
exports.addParticipants = async (req, res) => {
    try {
        const userId = req.user._id 

        const user = await User.findOne({ _id: userId})
        const event = await Event.findOne({ _id: req.params.eventId })
            if (event) {

                await Event.updateOne({ _id: event._id}, { $push: { participants: user} })
                return res.status(200).json({ message: 'participant successfully saved' })
            }
        


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
}
// add  participants
exports.deleteParticipants = async (req, res) => {
    try {
       
      
            const user = await User.findOne({ _id: req.params.userId })
            if (user) {

                await Event.updateOne({ _id: req.params.eventId}, { $pull: { participants: user._id } })
                return res.status(200).json({ message: 'participant successfully deleted' })
            }
        
        return res.status(404).json({ message: 'participant not found' })


    } catch (error) {
        res.status(500).json({ error: error })
        console.log(error)
    }
} 