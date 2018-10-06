<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we'll create a graphql back-end for an ecommerce site. Our goal will be to have a functioning cart that we can add items to, retrieve items from, edit quantities, and remove items from. In addition, we should be able to access products and specific products. If you need a reminder on structuring your mutations, queries, or other items, checkout the graphql-yoga documentation and the howtographql documentation.

## Step 1

### Summary

We'll start by setting up the skeleton for our GraphQL server. We'll start by creating the type definition for our Products and the Query type definition for retrieving all of our products.

### Instructions
* Add a new directory call `schema` to our `server/` directory.
* Next, add two files to our `schema/` directory
    * A typeDefs.graphql file (Where we'll set our type definitions using GraphQL's Schema Definition Language)
    * A resolvers.js file (Where we'll write the code that will retrieve the data being requested)
* Take a look at the `server/models/products.js` file
    * Notice the data we have available and what type that data is (Int, Boolean, String, Float, ID)
    * Navigate to our `typeDefs.graphql` file. Create a Product type that matches the structure of our product object. Each property should be marked as required
* Next, create a Query Type
    * We'll use the Query Type to describe what we'll be querying for and what the return data should look like.
    * Add a property on our Query Type called products who's return value is an array of Products.
    * The array should always have at least one Product and should always be an array (denoted by the !)

### Solution

<details>

<summary> <code> typeDefs.graphql </code> </summary>

```
type Product {
  id: ID!
  title: String!
  color: String!
  category: String!
  price: Int!
}

type Query {
  products: [Product!]!
}
```

</details>

## Step 2

### Summary

We now need to write a resolver, which is simply a function that aggregates data in some way, that satifies the Product Query we defined previously. It should return an array of products.

### Instructions
* Navigate to the `resolver.js` file
* At the top of the file, require our products model from `models/products.js` and store it to a variable called products
* Export an object with a single property of Query.
* Query should be an object that defines each of the methods we'll use to query for data.
    * These methods will match the properties of the query types we defined in our `typeDefs.graphql` file.
    * We defined a single Query called products.
    * Add a matching resolver function on our Query object called `products` that returns our array of products.

### Solution

<details>

<summary> <code> resolvers.js </code> </summary>

```
const products = require('../models/products')
const resolvers = {
  Query: {
    products() {
      return products;
    }
  }
}

module.exports = resolvers;
```

</details>

## Step 3

### Summary

In this step we'll setup our GraphQL server along with the built in graphiql testing tool. We'll also make our first request to Query data from our graphql server.

### Instructions
* Navigate to the `index.js` file
* Start by installing `graphql-yoga` from npm
* Then, require and destructure `GraphQLServer` from `graphql-yoga`
* Next, bring your `typeDefs` and `resolver` files into the index.
    * The resolver file can simply be required
    * Node does not know how to read `.graphql` files
        * We'll need to use the built in `fs` (file system) module's `readFileSync` property to read the file as `utf8`.
        * Set the output equal to a variable called `typeDefs`
* Create an options object with port, endpoint, and playground properties
    * The port should be 3001
    * The endpoint should be `/graphql` This is used to send requests from the client to the server.
    * The playground should be `/graphiql` This is our testing endpoint that enables and makes graphiql viewable in the browser
* Create your server
    * Declare a variable called server
    * Set server equal to a `new` GraphQLServer
    * Pass it a config object with your typeDefs and resolver as properties.
    * In addition, you can pass a context object that has access to the `req` object from express, but we won't be using it for this project. More on that <a href="https://github.com/prisma/graphql-yoga#constructorprops-props-graphqlserver">here.</a>
    * Start your server by calling `server.start`
        * Pass it the `options` from above
        * Pass it a callback to log the port from the options object
* Test!
    * Make sure your server is running, if not, debug!
    * Navigate to `http://localhost:3001/graphiql`
    * Explore your `schema` with the interactive docs on the right
    * Query for your products using the pane on the left
    * You should see an array of products on the right pane
* From here on out, any time your `Schema` changes, you'll need to refresh your browser so it has the latest version.


### Solution

<details>

<summary> <code> index.js </code> </summary>

```
const { readFileSync } = require('fs');
const { GraphQLServer } = require('graphql-yoga');

const typeDefs = readFileSync(`${__dirname}/schema/typeDefs.graphql`, 'utf8');
const resolvers = require('./schema/resolvers');

const options = {
  port: 3001,
  endpoint: '/graphql',
  playground: '/graphiql'
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // optional context function that accessesg the req object from express
  context: req => ({
    ...req.request
  })
});

server.start(options, () =>
  console.log(`Server is running on localhost:${options.port}`)
);
```

</details>

<details>

<summary> <code> Graphiql Interface </code> </summary>

```
{
    products {
        id
        title
        category
        price
        color
    }
}
```

</details>

## Step 4

### Summary

Now that our server is running, let's create a Query that will allow us to retrieve data on a single Product instead of all of our Products.

### Instructions
* Navigate to the `typeDefs.graphql` file
* Add a property to our Query type called product
    * It should expect an id as an argument and optionally return a Product
* Next, navigate to `resolvers.js`
* Add a resolver on our Query called product
    * resolver functions receive 3 arguments
        * parent (usually denoted by an _ because we won't be using it)
        * args (an object with any arguments, such as id, that are received by the Query or Mutation)
        * context (if we're using it)
    * product should return a product if one matches the passed in id on the arguments objects, or throw an error if there is no matching product.
* Test in graphiql


### Solution

<details>

<summary> <code> resolvers.js </code> </summary>

```
let products = require('../models/products');

const resolvers = {
  Query: {
    products() {
      return products;
    },
    // The second argument is our `arguments` object. It references the passed in arguements for your Query. Here we're destructuring the id, but you could reference it as `args.id`
    product(_, { id }) {
     const item = products.find(val => val.id === +id);
     if (!item) {
        throw new Error(`No Product With ID: ${id}`)
     }
      return products.find(val => val.id === +id);
    }
  }
}

```

</details>
<details>

<summary> <code> typeDefs.graphql </code> </summary>

```
type Product {
  id: ID!
  title: String!
  color: String!
  category: String!
  price: Int!
}

type Query {
  products: [Product!]!
  product(id: ID!): Product
}

```

</details>

## Step 5

### Summary

For this step, we'll add a cart and full CRUD functionality for our cart.

### Instructions
* Navigate to the `typeDefs.graphql` file
    * Here we'll add a quantity property to our Product type
    * It should be optional
    * It will only exist on Products in the `cart`
* Add a `cart` Query
    * It should expect an array of Products that may or may not be empty, but will always be an array.
* Next, navigate to `resolvers.js`
* Add a cart variable at the top of the document and default it to an empty array
* Add a `cart` query that returns the cart.
* Test in graphiql


### Solution

<details>

<summary> <code> resolvers.js </code> </summary>

```
let products = require('../models/products');

const resolvers = {
  Query: {
    products() {
      return products;
    },
    product(_, { id }) {
     const item = products.find(val => val.id === +id);
     if (!item) {
        throw new Error(`No Product With ID: ${id}`)
     }
      return products.find(val => val.id === +id);
    },
    cart() {
      return cart;
    }
  }
}

```

</details>
<details>

<summary> <code> typeDefs.js </code> </summary>

```
type Product {
  id: ID!
  title: String!
  color: String!
  category: String!
  price: Int!
  quantity: Int
}

type Query {
  products: [Product!]!
  product(id: ID!): Product
  cart: [Product]!
}
```

</details>

## Step 6

### Summary

Now that we have several ways to Query for data, we'll work on adding methods for updating, deleting, and posting data, otherwise called Muatations in GraphQL.

### Instructions
* Navigate to the `typeDefs.graphql` file
    * Here we'll add a type called `Mutation`.
    * `Mutation` should have 3 properties
        * `addProductToCart`
            * Expects an `id` argument of type `ID` (this will reference an item in our products to be added to cart)
            * Should expect a return value of an array that may or may not be empty or have `Product`. (This will be our updated cart we're returning)
        * `removeProductFromCart`
            * Expects an `id` argument of type `ID`
            * Should expect a required return value of an `ID` (We send this back to tell the UI what item was removed)
        * `updateQuantity`
            * Expects an `id` argument of type `ID` and a `change` argument of type `String` (change will be either up or down to increase or decrease the quantity)
            * Should return a `Product`

### Solution

<details>

<summary> <code> typeDefs.graphql </code> </summary>

```
type Product {
  id: ID!
  title: String!
  color: String!
  category: String!
  price: Int!
  quantity: Int
}

type Query {
  products: [Product!]!
  product(id: ID!): Product
  cart: [Product]!
}

type Mutation {
  addProductToCart(id: ID!): [Product]!
  removeProductFromCart(id: ID!): ID!
  updateQuantity(id: ID!, change: String!): Product
}

```

</details>

## Step 7

### Summary

In this step we'll write the resolver functions that will match up to our `Mutation` type that we described in the previous step.

### Instructions
* Navigate to the `resolvers.js` file
    * Add a property whose value should be an object on our exported object called `Mutation`
    * `Mutation` should have 3 properties that are functions
        * `addProductToCart`
            * Expects an `id` argument
            * Should check to see if the item is already in the cart
                * If it is, add one to the quantity
                * If it isn't, find and clone the product, add a quantity property to the clone, and push the clone into the cart
                * Throw an error if the `id` is not found in the products
            * Return the cart
        * `removeProductFromCart`
            * Expects an `id` argument
            * Throw an error if the `id` is not in the cart
            * Should remove the matching product from the cart
            * Return the `id`
        * `updateQuantity`
            * Expects an `id` argument and a `change` argument
            * Throw an error if the `id` is not in the cart
            * If the `change` is `up` and one to the matching cartItems quantity
            * If the `change` is `down` and the cartItems quantity is greater than 0, subtract one from the quantity.
            * Return the cartItem
* Test in graphiql

### Solution

<details>

<summary> <code> resolvers.js </code> </summary>

```
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
```
</details>

* We should now have a functioning GraphQL API!

### Next Steps

The following is optional. There are currently no instructions for client setup.

Integrate one or several of your features using the Apollo Client for React. `create-react-app` has already been run for you. You'll need to install the Apollo dependencies, create an Apollo Client, and setup the Apollo Provider to get started.
For a refresher, checkout the Apollo Graphql getting started section <a href="https://www.apollographql.com/docs/react/essentials/get-started.html">here.</a> This will walk you through what you need to install and how to get all the pieces setup.

Be imaginative, or build a vanilla ecommerce frontend, it's up to you!

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2018. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
