
const mongoose = require('mongoose');
const Counter = require('./counterModel');

const todoSchema = new mongoose.Schema({
    todoId :{
        type: Number,
        unique: true
    },
    title : {
        type : String,
        required : true,
    },
    description :{
        type : String,
        required : true,
    },
    completed : {
        type : Boolean,
        default : false,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
    updatedAt : {
        type : Date,
        default : Date.now,
    },
},{
    timestamps : true,
});

// Pre-save hook to set the todoId
todoSchema.pre('save' , async function(next){
    const doc = this;
    if (this.isNew){
        try{
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'todoId' },  // Look for a document with ID 'todoId'
                { $inc: { seq: 1 } }, // Increment the seq field by 1
                { new: true, upsert: true } // Create it if it doesn't exist
            );
            doc.todoId = counter.seq;
            return next();
        } catch (err){
            return next(err);
        }
    }
    next();
});


module.exports = mongoose.model('Todo', todoSchema , 'todos');

