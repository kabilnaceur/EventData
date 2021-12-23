const Event = require('../models/event')

// get all events
exports.getEvents = async (req,res)=> {
    Event.find()
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
        description : req.body.description,
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
            description : req.body.description,
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