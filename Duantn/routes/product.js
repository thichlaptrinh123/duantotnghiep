const express = require('express');
const router = express.Router();
const productController = require('../controllers/c_product')


// http://localhost:8989/product
router.get('/',async(req,res)=>{
    try{
        const product = await productController.getAll();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})


// http://localhost:8989/product/hot
router.get('/hot',async(req,res)=>{
    try{
        const product = await productController.getHot();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})


// http://localhost:8989/product/new
router.get('/new',async(req,res)=>{
    try{
        const product = await productController.getNew();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})

// http://localhost:8989/product/sale
router.get('/sale',async(req,res)=>{
    try{
        const product = await productController.getSale();
        res.status(200).json({status: 1, data: product});
    }catch(error){
        res.status(400).json({status: 0, data: error.message});
    }
})
module.exports = router;