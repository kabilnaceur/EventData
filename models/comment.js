const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
  comment : {
    type : String,
    required:true
},

    date : {
        type: Date,
        default: Date.now
    },
 
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

})
module.exports = mongoose.model('Comment',CommentSchema)