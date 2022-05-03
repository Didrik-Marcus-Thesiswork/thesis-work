import express  from 'express';
import { librariesSchema } from '../schema.js'
import { rootMysql } from '../root/mysql-root.js'
import { graphqlHTTP } from 'express-graphql';

var mysqlRouter = express.Router()

mysqlRouter.use('/', graphqlHTTP ({
    schema: librariesSchema,
    rootValue: rootMysql,
    graphiql: true
}))

export { mysqlRouter }