const { graphql, buildSchema } = require('graphql')
const fs = require('fs')

const model = require('./model') //Database

const my_graph = require('./my-graph.json')
console.log(JSON.stringify(my_graph))


let DB
model.getDB().then(db => {DB=db})

const ObjectId = require('bson-objectid')

const sse  = require('./utils/notifications') //Notifications
sse.start()


const schema = buildSchema(`
  type Query {
    hello: String
    users: [User]
    apiVersion: [Version]
    products: [Product]
    searchProductsByName(name:String!):[Product]
    searchProductsByCategory(category:String!):[Product]
    searchProductsByMarca(marca:String!):[Product]
    searchProductsByCapacidad(capacidad: Int!):[Product]
    searchProductsByQuantity(quantity: Int!):[Product]
  }
  type Mutation {
    addUser(name:String!, passwd:String!):User!
    addProduct(name:String!, category:String!, marca: String!, capacidad: Int!, quantity: Int!):Product
    addContract(name: String!, category: String!, marca: String!, capacidad: Int!, quantity: Int!):Contract
    deleteProduct(name:String!):String
  }

  type User{
    _id: ID
    name: String
    passwd: String
  }

  type Version{
    _id: ID,
    name: String
    version: String
  }

  type Product{
    _id: ID
    name: String
    category: String
    marca: String
    capacidad: Int
    quantity: Int
  }

  type Contract{
    _id: ID
    name: String
    cantidad: String
    product: String
    user: String
    duracion: Int
  }
`)


const rootValue = {
     hello : () => "Hello World!",
     users : () => DB.objects('User'),
     apiVersion: () => DB.objects('Version'),
     products: () => DB.objects('Product'),
     contracts: () => DB.objects('Contract'),
     searchProductsByName: ({ name }) => {
      name = name.toLowerCase()
      return DB.objects('Product').filter(x => x.name.toLowerCase().includes(name))
    },
    searchProductsByCategory: ({ category }) => {
      category = marca.toLowerCase()
      return DB.objects('Product').filter(x => x.category.toLowerCase().includes(category))
    },
    searchProductsByMarca: ({ marca }) => {
      marca = marca.toLowerCase()
      return DB.objects('Product').filter(x => x.marca.toLowerCase().includes(marca))
    },
    searchProductsByCapacidad: ({ capacidad }) => {
      capacidad = capacidad.toLowerCase()
      return DB.objects('Product').filter(x => x.capacidad.toLowerCase().includes(capacidad))
    },
    searchProductsByQuantity: ({ quantity }) => {
      quantity = quantity.toLowerCase()
      return DB.objects('Product').filter(x => x.quantity.toLowerCase().includes(quantity))
    },
     addProduct: ({name, category, marca, capacidad, quantity}) => {
      let data = {
        _id: ObjectId(),
        _partition: model.partitionKey,
        name: name,
        category: category,
        marca: marca,
        capacidad: capacidad,
        quantity: quantity
      }
      DB.write( () => {post = DB.create('Product', data)})
      // SSE notification
      sse.emitter.emit('new-product', data)
      return data
     },
    addUser: ({name, passwd}) => {
      let data  = null
      if ( name.length>0 && passwd.length>0){
        data = {
          _id: ObjectId(),
          _partition: model.partitionKey,
          name: name,
          passwd: passwd
        }
        DB.write( () => {post = DB.create('User', data)})
      }
      if (data) return data
    }
}

exports.root   = rootValue
exports.schema = schema
exports.sse    = sse
