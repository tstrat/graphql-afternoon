<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250" align="right">

# Project Summary

In this project, we'll create a graphql back-end for an ecommerce site. Our goal will be to have a functioning cart that we can add items to, retrieve items from, edit quantities, and remove items from. In addition, we should be able to access products and specific products.

## Step 1

### Summary

We'll start by setting up the skeleton for our GraphQL server. We'll start by creating the type definition for our Products and the Query type definition for retrieving all of our products.

### Instructions
* Add a new directory call `schema` to our `server/` directory.
* Next, add two files to our `schema/` directory
    * A typeDefs.graphql file (Where we'll set our type definitions using GraphQL's SDL)
    * A resolvers.js file (Where we'll write the code that will retrieve the data being requested)
* Take a look at the `server/models/products.js` file
    * Notice the data we have available and what type that data is (Int, Boolean, String, Float, ID)
    * Navigate to our `typeDefs.graphql` file. Create a Product type that matches the structure of our product object. Each property should be marked as required
* Next, create a Query Type
    * We'll use the Query Type to describe what we'll be querying for and what the reutrn data should look like.
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
* Start by installing `graphql-apollo`
* Then, require and destructure `GraphQLServer` from `graphql-apollo`
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
  // optional context function that accesses the req object from express
  context: req => ({
    ...req.request
  })
});

server.start(options, () =>
  console.log(`Server is running on localhost:${options.port}`)
);
```

</details>

## Contributions

If you see a problem or a typo, please fork, make the necessary changes, and create a pull request so we can review your changes and merge them into the master repo and branch.

## Copyright

© DevMountain LLC, 2018. Unauthorized use and/or duplication of this material without express and written permission from DevMountain, LLC is strictly prohibited. Excerpts and links may be used, provided that full and clear credit is given to DevMountain with appropriate and specific direction to the original content.

<p align="center">
<img src="https://s3.amazonaws.com/devmountain/readme-logo.png" width="250">
</p>
