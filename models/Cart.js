const mongoose = require('mongoose');


const cartSchema = mongoose.Schema({
    // ID user's
    _id :{
        required : true ,
        type : String ,
    } ,
    totalQuantity : {
        required : true ,
        type : Number
    } ,
    totalPrice : {
        required : true ,
        type : Number
    } ,
    selectedProduct:{
        // exist relationship between product and cart
        required : true ,
        type : Array ,
    }


})



module.exports = mongoose.model('Cart' , cartSchema );