const products = require('../models/products')
const cart = []
const resolvers = {
  Query: {
    products() {
      return products
    },
    product(_, { id }) {
        const item = products.find(product => product.id === id)
        if (item) {
            return item;
        } else {
            throw new Error(`No product found with id : ${id}`);
        }
    },
    cart() {
        return cart
    }
  },
  Mutation: {
    addProductToCart(_, {id}) {
        const item = products.find(prod => prod.id === parseInt(id));
        if (!item) {
            throw new Error(`No Product With ID: ${id}`);
          }
        else {
            const cartItem = cart.find(prod => prod.id === +id);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.push({...item, quantity: 1});
            }
            return cart
        }
    },
    removeProductFromCart(_, { id }, req) {
        const cartItem = cart.find(val => val.id === +id);
        if (!cartItem) {
          throw new Error(`No Item With ID: ${id}`);
        }
        console.log(cart.findIndex(item => item.id === + id));
        cart.splice(cart.findIndex(item=> item.id === +id), 1)
        return id;
    },
    updateQuantity(_, { id, change }) {
        const cartItem = cart.find(val => val.id === +id);
        if (!cartItem) {
          throw new Error(`No cartItem Matching ID: ${id}`);
        }
        if (change === 'up') {
          cartItem.quantity += 1;
        } else if (change === 'down' && cartItem.quantity > 0) {
          cartItem.quantity -= 1;
        }
        return cartItem;
    }
  }
}

module.exports = resolvers;