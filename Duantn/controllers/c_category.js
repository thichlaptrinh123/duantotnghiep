const categoryModel = require ('../models/m_category');

const getAll = async() => {
    try{
        const categories = await categoryModel
                .find();
        if (categories.length == 0 ) {
            throw new Error('Không có dữ liệu');
        }
        return categories;        
    }catch (error) {
        console.log(' get category error:' + error);
        throw new Error('lỗi lấy dữ liệu');
    }
}

module.exports = {getAll};