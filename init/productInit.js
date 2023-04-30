const Product = require('../models/Product');
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Shopping-cart').then(() => {

    console.log('Connected to DB')
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err)
});
// delete all products
/*
Product.deleteMany()
.then(doc=>{
  console.log(doc);
})
.catch(err=>{
  if (err) {
    console.log(err)
  }
})
*/

const products = [
    new Product({
        imagePath: '/images/26be56634ad9773c9d8f6315cac2cba7.jpg',
        productName: 'Apple iPhone 14',
        information: {

            storageCapacity: 265,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 16,
            displaySize: 6.7
        },
        price: 46772
    }),
    new Product({
        imagePath: '/images/61d2f96992b57c0004c64748.png',
        productName: 'Apple iPhone X',
        information: {

            storageCapacity: 128,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 8,
            displaySize: 5.1
        },
        price: 13000
    }),
    new Product({
        imagePath: '/images/61d2f9ce92b57c0004c64749.png',
        productName: 'Apple iPhone 13',
        information: {

            storageCapacity: 265,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 64,
            displaySize: 7
        },
        price: 22000
    }),
    new Product({
        imagePath: '/images/e0209810f10ff95e5029a9b7290c69fe.jpg',
        productName: 'Apple iPhone 13 Pro',
        information: {

            storageCapacity: 265,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 32,
            displaySize: 7
        },
        price: 26000
    }),
    new Product({
        imagePath: '/images/iphone_13_PNG32.png',
        productName: 'Apple iPhone 13',
        information: {

            storageCapacity: 64,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 16,
            displaySize: 7.5
        },
        price: 18000
    }),
    new Product({
        imagePath: '/images/iphone_13_PNG30.png',
        productName: 'Apple iPhone 14',
        information: {

            storageCapacity: 16,
            numberOfSIM: 'Dual SIM',
            cameraResolution: 16,
            displaySize: 6
        },
        price: 17000
    })
]

var done = 0 ;

for (let index = 0; index < products.length; index++) {
    products[index].save()
        .then(doc => {
            console.log(doc);
            done ++;
            if (done === products.length) {
                // لو كنت حطيتها برا كان هيجبلي ايرور بسبب الكول باك فانكشن
                mongoose.disconnect();
            }
        })
        .catch(err => {
            console.log(err);
        })

}



