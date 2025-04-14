const Todo = require('../models/todo');
const Counter = require('../models/counterModel');

// Create a new todo
exports.createTodos = async (req, res) => {
    try {
        // Create a new Todo - the pre-save hook will handle the ID increment
        const todo = new Todo(req.body);
        const saveTodo = await todo.save();
        res.status(201).json(saveTodo);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
};

// Get all todos
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

// Get todo by ID
exports.getTodoById = async (req, res) => {
    try {
        const todo = await Todo.findOne({ todoId: req.params.id });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
};

// Update todo
exports.updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { todoId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        console.error(error);
        res.status(400).json({message: error.message});
    }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
    const deletedId = parseInt(req.params.id);  // convert string to number
    try {
        const todo = await Todo.findOneAndDelete({ todoId: deletedId });
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        await Todo.updateMany( // Step 1: Decrement todoId of all documents with higher todoId
            { todoId: { $gt: deletedId } },
            { $inc: { todoId: -1 } }
        );
        await Counter.findByIdAndUpdate( // Step 2: Decrement the counter
            { _id: 'todoId' },
            { $inc: { seq: -1 } },
            { new: true }
        );
        return res.status(200).json({ message: 'Todo deleted and IDs updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

