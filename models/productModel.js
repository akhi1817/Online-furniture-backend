const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,  
    },
    productImage: {
        type: [String],
        required: true, 
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number'], 
    },
    sellingPrice: {
        type: Number,
        min: [0, 'Selling Price must be a positive number'],
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
