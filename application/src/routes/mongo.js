import express  from 'express';
import { librariesSchema } from '../schema.js'
import { rootMongo } from '../root/mongo-root.js'
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
var mongoRouter = express.Router()

mongoRouter.use('/', graphqlHTTP ({
    schema: buildSchema(librariesSchema),
    rootValue: rootMongo,
    graphiql: true
}))

export { mongoRouter }