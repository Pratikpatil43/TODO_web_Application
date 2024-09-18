const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    task:{type:String, required:true},
    time:{type:String, required:true},
    description:{type:String, required:true},
    taskAction:{type:String, required:true},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference the User model
        required: true,
    }


})

module.exports = mongoose.model("userTasks",TaskSchema)