let products = require('../models/products');
let cart = [];

const resolvers = {
  Query: {
    products() {
      return products;
    },
    product(_, { id }) {
      return products.find(val => val.id === +id);
    },
    cart() {
      return cart;
    }
  },
  Mutation: {
    addProductToCart(_, { id }, req) {
      const cartItem = cart.find(val => val.id === +id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        const product = products.find(val => val.id === +id);
        if (!product) {
          throw new Error(`No Product With ID: ${id}`);
        }
        const productClone = {
          ...product,
          quantity: 1
        };
        cart.push(productClone);
      }
      return cart;
    },
    removeProductFromCart(_, { id }, req) {
      const cartItem = cart.find(val => val.id === +id);
      if (!cartItem) {
        throw new Error(`No Item With ID: ${id}`);
      }
      cart = cart.filter(val => val.id !== +id);
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
};

module.exports = resolvers;
