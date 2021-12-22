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
        type:String,
        required:true
    },
    descreption : {
        type : String
    },
 
user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

})
module.exports = mongoose.model('Event',EventSchema)