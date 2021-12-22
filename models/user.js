const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name : {
    type : String,
    required:true
},
email : {
    type:String,
    required:true
},
    username : {
        type:String,
        required:true
    },
    password : {
        type : String
    },
 
events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

})
module.exports = mongoose.model('User',UserSchema)