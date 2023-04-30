var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
const Cart = require('../models/Cart');
const stripe = require('stripe')('sk_test_51N1mzfGxUFhFsMJUNyOukeyXg2B96CzlTokgkRBOyft2BuzwFJdI4ImTHIrBous3BvGQdlvVtIabMlpl0x5tJzid00cYCOcNRu'); 


router.get('/', function (req, res, next) {
  // console.log(req.session);
  // console.log(req.user);
  const successMsg = req.flash('success')[0] ; 
  var totalProducts = null;
  if (req.isAuthenticated()) {
    /*
    console.log(req.user);
    console.log(req.user.cart);
    console.log(req.user.cart.totalQuantity);
    */
    if (req.user.cart) { //here add object cart if user 3ndo cart (in session (not db))
      console.log(req.user);
      totalProducts = req.user.cart.totalQuantity;
    } else {
      totalProducts = 0;
    }

  }

  Product.find({})
    .then(doc => {
      // doc is array of object
      // console.log(doc);

      // return [(row1) [ {}  {}  {} ] , (row2)[ {} {} {} ] ]
      // matrix
      var productGrid = [];
      var colGrid = 3;

      for (let i = 0; i < doc.length; i = i + colGrid) {
        // first time = 0 , 3
        // second time = 3 , 6 
        // slice : cut in new array and not change the original array.
        productGrid.push(doc.slice(i, i + colGrid));
        // here divide array 3 and 3 in to array
      }
      // console.log(productGrid)
      // res.render should in here because call back function
      // console.log(req.isAuthenticated())
      res.render('index', {
        title: 'Shopping Cart',
        products: productGrid,
        checkUser: req.isAuthenticated(),
        totalProducts: totalProducts,
        successMsg : successMsg
      });

    })
    .catch(err => {
      console.log(err)
    })

});


router.get('/addtocart/:id/:price/:name', (req, res, next) => {
  // Delete All Schema in database (delete data)
  /*
  Cart.deleteMany()
  .then(doc=>{
    console.log(doc)
  })
  .catch(err=>{
    if (err) {
      console.log(err)
    }
  })
*/

  //if me need id product or any think from hbs
  //console.log(req.params.id); 
  //console.log(req.params.price);
  // console.log(req.user[0]._id); 

  // if (req.isAuthenticated()) { // كان ممكن اعمل كوديشن في حته ان لما يجي يشتري واشوفه مسجل ولا لا زي كدا واشوف الالس اللي في الاخر برضو واوديه علي صفحه التسجيل

  const cartID = req.user[0]._id;//in passport.deserializeUser saved in session
  const newProductPrice = parseInt(req.params.price, 10);

  const newProduct = {
    _id: req.params.id,
    price: newProductPrice,
    name: req.params.name,
    quantity: 1,
  };

  // Check Do exist cart or not
  Cart.findById(cartID)
    .then(cart => {
      //if not exist any cart to this user will cart is null
      if (!cart) { //if cart = null or false
        const newCart = new Cart({
          _id: cartID,
          totalQuantity: 1, //because will user select one item in start
          totalPrice: newProductPrice,
          selectedProduct: [newProduct]
        });
        // saved in db
        newCart.save()
          .then(doc => { console.log(doc); })
          .catch(err => { if (err) console.log(err); })
      }
      // check if cart exist
      if (cart) {
        let indexOfProduct = -1;
        for (let i = 0; i < cart.selectedProduct.length; i++) {
          // if the same product exist 
          if (req.params.id === cart.selectedProduct[i]._id) {
            indexOfProduct = i;
            break;
          }
        }
        // Update product (product exist)
        if (indexOfProduct >= 0) {
          // Update items 
          cart.selectedProduct[indexOfProduct].price += newProductPrice;
          cart.selectedProduct[indexOfProduct].quantity += 1;
          cart.totalQuantity += 1;
          cart.totalPrice += newProductPrice;
          // Update schema
          Cart.updateOne({ _id: cartID }, { $set: cart })
            .then(doc => {
              console.log(doc);
              // console.log(cart);
            })
            .catch(err => { if (err) console.log(err); })
        }
        // new order product
        else {
          // Update items 
          cart.totalQuantity += 1;
          cart.totalPrice += newProductPrice;
          cart.selectedProduct.push(newProduct);
          // Update schema
          Cart.updateOne({ _id: cartID }, { $set: cart })
            .then(doc => {
              console.log(doc);
              console.log(cart);
            })
            .catch(err => { if (err) console.log(err); })

        }
      }


    })
    .catch(err => {
      if (err) {
        console.log(err);
      }
    })

  res.redirect('/');

  // } //end if
  // else{
  //   res.redirect('/users/signin');
  // }

})

router.get('/shopping-cart', (req, res, next) => {
  if (!req.isAuthenticated()) { //if user not sing in
    res.redirect('/users/signin');
    // console.log('req.user');

    return;
  }
  if (!req.user.cart) { //if it have not cart
    res.render('shoppingcart', { checkUser: true, totalProducts: 0 });
    return;
  }

  const userCart = req.user.cart;
  const totalProducts = req.user.cart.totalQuantity;

  res.render('shoppingcart', { userCart: userCart, checkUser: true, totalProducts: totalProducts });
})

// increase Produce
router.get('/increaseProduct/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  // console.log(userCart.selectedProduct[index]);
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity; //price / quantity 

  userCart.selectedProduct[index].quantity += 1;
  userCart.selectedProduct[index].price += productPrice;
  userCart.totalPrice += productPrice;
  userCart.totalQuantity += 1;

  Cart.updateOne({ _id: userCart._id }, { $set: userCart })
    .then(doc => {
      console.log(doc);
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    })

})

// Decrease Produce
router.get('/decreaseProduct/:index', (req, res, next) => {
  const index = req.params.index;
  const userCart = req.user.cart;
  const productPrice = userCart.selectedProduct[index].price / userCart.selectedProduct[index].quantity; //price / quantity 

  userCart.selectedProduct[index].quantity -= 1;
  userCart.selectedProduct[index].price -= productPrice;
  userCart.totalPrice -= productPrice;
  userCart.totalQuantity -= 1;

  Cart.updateOne({ _id: userCart._id }, { $set: userCart })
    .then(doc => {
      console.log(doc);
      res.redirect('/shopping-cart');
    })
    .catch(err => {
      console.log(err);
    })
})

// Delete Product
router.get('/deleteProduct/:index', (req, res, next) => {

  const index = req.params.index;
  const userCart = req.user.cart;
  if (userCart.selectedProduct.length <= 1) { // if exist one product will delete cart from db
    Cart.deleteOne({ _id: userCart.id })
      .then(doc => {
        console.log(doc);
        res.redirect('/shopping-cart');
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
  } else {
    // Update data in cart
    userCart.totalPrice -= userCart.selectedProduct[index].price;
    userCart.totalQuantity -= userCart.selectedProduct[index].quantity;

    userCart.selectedProduct.splice(index, 1); // index [position start delete] , 1[delete count];
    // Update in db
    Cart.updateOne({ _id: userCart._id }, { $set: userCart })
      .then(doc => {
        console.log(doc);
        res.redirect('/shopping-cart');
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
  }

})

// Delete All Product
router.get('/deleteAllProduct', (req, res, next) => {
  const userCart = req.user.cart;

  Cart.deleteOne({ _id: userCart.id })
    .then(doc => {
      console.log(doc);

      res.redirect('/shopping-cart');
    })
    .catch(err => {
      if (err) {
        console.log(err);
      }
    })
})

router.get('/checkout', (req, res, next) => {
  if (!req.isAuthenticated()) { //if user not sing in
    res.redirect('/users/signin');
    return;
  }
  if (!req.user.cart) { //if it have not cart
    res.render('shoppingcart', { checkUser: true, totalProducts: 0 });
    return;
  }
  const errorMsg = req.flash('error')[0];
  res.render('checkout', { checkUser: true, 
    totalProducts: req.user.cart.totalQuantity  , 
    totalPrice : req.user.cart.totalPrice,
    errorMsg : errorMsg
  });
})

// if user buy and enter success data credit card
router.post('/checkout' , (req , res , next)=>{
  // Create a new customer and then create an invoice item then invoice it:
stripe.charges
.create({
  amount : req.user.cart.totalPrice ,
  currency : "egp",
  source : req.body.stripeToken,
  description: 'charge for test@example.com' , 
})
.then((charge) => {
  // have access to the customer object
  console.log(charge);
  req.flash('success' , 'Successfully bought product !!');
  // Delete Cart From User
  Cart.deleteOne({_id : req.user.cart._id})
  .then(doc =>{
    console.log(req.user);
    console.log(doc);
    res.redirect('/');
  })
  .catch(err =>{
    console.log(err);
  })

  
    
})
.catch((err) => {
  // Deal with an error

  console.log(err.raw.message);
  req.flash('error' , err.raw.message);
  res.redirect('/checkout');
});

  // res.redirect('/checkout');
})





module.exports = router;
