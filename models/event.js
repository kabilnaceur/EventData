const mongoose = require('mongoose')

const EventSchema = mongoose.Schema({
  name : {
    type : String,
    required:true
},
type : {
    type:String,
    required:true
},
    numberParticipants : {
        type:Number,
        default:1
    },
    descreption : {
        type : String
    },
    date : {
        type: Date
    },
    location:{
        type:String,
        required:true
    },
 
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
comments:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'  }]

})
module.exports = mongoose.model('Event',EventSchema)