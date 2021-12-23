const Comment = require('../models/comment')

// get all Comments
exports.getComments = async (req,res)=> {
    Comment.find()
    .exec()
    .then(data => {
        res.json(data);
    
    })



    .catch(err => {
        console.log(err)
        res.json({ message: err})
    })
}
// get comment

exports.getComment = async (req, res) => {
    Comment.findById(req.params.commentId)
    .exec()
    .then(data => {
        res.json(data);
  
    })
    .catch(err => {
        console.log(err)
        res.json({ message: err })
    })
  }
  // delete comment
  exports.deleteComment = async (req, res) => {

    User.remove({ _id: req.params.commentId })
    .exec()
    .then(data => {
        res.json(data);
  
    })
    .catch(err => {
        console.log(err)
        res.json({ message: err })
    })
}
// add comment
exports.createComment = (req,res)=>{
    const comment = new Comment ({
        comment:req.body.comment,
        user : req.user.userId

    }) 
    comment.save()
    .then(data => {
        res.json(data);
    
    })
    .catch(err => {
        res.json({ message: err})
    })
}
// edit comment
exports.editComment = async (req,res) => {
    const updateOps = {};
for (const ops of req.body) {
  updateOps[ops.propName] = ops.value;
}
 await Comment.findOneAndUpdate(
  { _id: req.params.commentId},
  { $set: updateOps },
  { new: true }
) 
.then(result=>{
    res.status(200).json({ message: 'Updated successfully' , result:result})
}).catch(err=>{
    res.json({message:err})
    res.status(404).json({ message: 'The Comment with the given ID is not found' });
})}