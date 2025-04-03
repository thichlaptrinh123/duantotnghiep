const productModel = require ('../models/m_product');

const getAll = async() => {
    try{
        const products = await productModel
                .find();
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getHot = async() => {
    try{
        const products = await productModel
                .find({product_hot: 1});
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product hot error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getNew = async() => {
    try{
        const products = await productModel
                .find({product_new: 1});
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product new error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

const getSale = async() => {
    try{
        let query = {};
        query.sale = {$gt: 0};
        const products = await productModel
                .find(query);
        if (products.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return products;        
    }catch (error) {
        console.log(' get product new error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}
module.exports = {getAll,getHot,getNew,getSale};