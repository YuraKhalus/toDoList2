const express = require('express');
const router = express.Router();
const Task = require('../models/Task.js');
const { validateTask, validateObjectId } = require('../middlewere/validation.js')

router.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`)
    next();
})

router.get('/', async (req, res) => {
    try{
        const { priority, sortBy } = req.query;
        let filert = {}
        if(priority){
            filert.priority = priority;
        }

        let query = Task.find(filert);

        if(sortBy === "data" || sortBy === "date") {
            query = query.sort({data: -1 })
        }
        let tasks = await query;
        
        if(sortBy === "priority") {
            const priorityOrder = {high: 1, medium: 2, low: 3 };
            tasks.sort((a, b) => {
                return (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
            });
        }

        return res.status(200).json({
            success: true,
            tasks
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Помилка отримання завдань",
            error: error.message
        })
    }

})

router.post('/', validateTask, async (req, res) => {
    try {
        const { title, description, priority, data } = req.body;

        console.log(req.body);

        const newTask = await Task.create({
            title,
            description: description || '',
            priority: priority || 'low',
            data: data || new Date().toISOString().split('T')[0],
        })

        return res.json({
            success: true,
            message: 'Завдання успішно створено',
            task: newTask,
        })
 
    } catch(error) {
        return res.status(400).json({
            success: false,
            message: `Помилка створення завдання`,
            error: error.message,
        });
    }
})
router.put('/:id', validateObjectId, validateTask, async (req, res) => {
    try{
        const { id } = req.params;
        const { title, description, priority, data } = req.body;

        const updetedTask = await Task.findByIdAndUpdate(
            id,
            {title, description, priority, data},
            {new: true, ranValidators: true}
        );

        if(!updetedTask){
            return res.status(404).json({
                success: false,
                message: "Завдання не знайдено"
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Завдання успішно оновлено',
            task: updetedTask
        })

    } catch(error) {
        return res.status(400).json({
            success: false,
            message: `Помилка редагування завдання`,
            error: error.message,
        });
    }
})

router.delete('/:id', validateObjectId, async (req, res) => {
    try{
        console.log('delete method')
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if(!deletedTask){
            return res.status(404).json({ 
                success: false,
                message: 'Незнайдено такої задачі'
            })
        }
        return res.status(200).json({
            success: true,
            message: "Завдання успишно видалено"
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: `Помилка видалення завдання`,
            error: error.message,
        });
    }

})

module.exports = router;
