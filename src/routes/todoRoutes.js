
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { authenticate } = require('../middleware/auth');


router.post('/todos',authenticate, todoController.createTodos);
router.get('/todos',authenticate,todoController.getAllTodos);
router.get('/todos/:id',authenticate,todoController.getTodoById);
router.put('/todos/:id',authenticate,todoController.updateTodo);
router.delete('/todos/:id',authenticate,todoController.deleteTodo);

module.exports = router;