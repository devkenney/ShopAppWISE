const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// ROUTE TO CREATE A USER

router.post('/', (req, res) => {
  const userData = req.body
  User.create(userData, (error, createdUser) => {
    if (error) {
      console.error(error);
      res.status(400).json({
        error: 'an error has occurred'
      })
    } else {
      console.log('created user successfully');
      res.status(201).json({
        message: 'Created Successfully',
        user: createdUser
      })
    }
  })
})

// ROUTE TO DELETE A USER

router.delete('/:id', (req, res) => {
  Product.deleteMany({ // deletes a bunch of products
    seller: req.params.id // only deletes the products that have the seller of the one we're deleting
  }, (error, resultA) => {

    // -------------------------------

    if (error) {
      console.error(error);
      res.status(404).json({ // error handling magic
        error: 'No products found!'
      })

      // ----------------------------

    } else {
      User.findOne({ // finds One User
        _id: req.params.id // only the user that is going to be deleted later -- we do this because we need the information from the user to be able to figure out which favorites they have!
      }, (error, foundUser) => {

        // -----------------------

        if (error) {
          console.error(error)
          res.status(404).json({ // error handling magic
            error: "no user found"
          })

          // ------------------------

        } else {
          Product.updateMany({ // updates multiple products
            $in: {
              _id: foundUser.favorites // only the products with _ids found within the User's favorites list
            }
          },
          
          // --------------------------

          {
            $pull: {
              favorite_users: foundUser._id // pulls the User's _id out of the favorite_users list
            }
          }, (error, updatedProduct) => {

            // ---------------------------

            if (error) {
              console.error(error); // error handling magic
              res.status(404).json({
                error: "product not found"
              })

              // --------------------------

            } else {
              console.log(`Successfully deleted ${resultA.deletedCount} products that were sold by the User.`)
              User.deleteOne({ // deletes one user
                _id: req.params.id // only the user we want to delete
              }, (error, resultB) => {

                // ---------------------------

                if (error) {
                  console.error(error); // error handling magic
                  res.status(404).json({
                    error: 'No User found!'
                  })

                  // ---------------------------

                } else {
                  console.log('Successfully deleted User');
                  res.status(204).json({}); // sends back 204 when we succeed in all three operations.
                }
              })
            }
          })
        }
      })
    }
  })
})

// ROUTE FOR ADDING A PRODUCT TO FAVORITES

router.put('/favorite/:userId/:productId', (req, res) => {
  User.updateOne({ // we are updating one user
    _id: req.params.userId // only the user that is adding the favorite
  }, {
    $push: {
      favorites: req.params.productId // pushing the objectId of the product they are favoriting into their favorites list
    }
  }, (error, updatedUser) => {

    // ----------------------

    if (error) {
      console.error(error);
      res.status(404).json({ // error handling magic
        error: 'User not found'
      });

      // -----------------------

    } else {
      Product.updateOne({ // updating one product
        _id: req.params.productId // only the product that is being added as a favorite
      }, {
        $push: {
          favorite_users: req.params.userId // pushing the objectId of the user that is doing the favoriting into their list of favorite users
        }
      }, (error, updatedProduct) => {
        
        // --------------------------
        
        if (error) {
          console.error(error); // more error handling magic
          res.status(404).json({
            error: 'Product not found'
          })

          // ----------------------------

        } else {
          res.status(202).json({
            message: 'Successfully updated the user and product favorite lists'
          }) // sends back a 202 when both operations are complete!
        }
      })
    }
  })
})

module.exports = router;