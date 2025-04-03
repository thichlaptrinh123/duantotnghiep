const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/c_category')

//http://localhost:8989/category
router.get('/', async(req, res)=>{
    try{
        const categories = await categoryController.getAll();
        res.status(200).json({status: 1, data: categories});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})

module.exports = router;