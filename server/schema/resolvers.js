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
        product.quantity = 1;
        cart.push(product);
      }
      return cart;
    },
    removeProductFromCart(_, { id }, req) {
      cart = cart.filter(val => val.id !== +id);
      return id;
    },
    updateQuantity(_, { id, change }) {
      const product = cart.find(val => val.id === +id);
      if (!product) {
        throw new Error(`No Product Matching ID: ${id}`);
      }
      if (change === 'up') {
        product.quantity += 1;
      } else if (change === 'down' && product.quantity > 0) {
        product.quantity -= 1;
      }
      return product;
    }
  }
};

module.exports = resolvers;
