const { version } = require('graphql')
const Realm = require('realm')

const ObjectId = require('bson-objectid')
const app = new Realm.App({ id: "application_etec-wiime" })


let UserSchema = {
   name: 'User',
   primaryKey: '_id',
   properties: {
      _id: 'objectId',
      _partition: 'string',
      name: 'string',
      passwd: 'string'
   }
}

let ApiVersionSchema = {
  name : 'Version',
  primaryKey: '_id',
  properties:{
    _id: 'objectId',
    _partition: 'string',
     name: 'string',
     version: 'string'
   }
}

let ProductSchema = {
  name: 'Product',
  primaryKey: '_id',
  properties:{
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    category: 'string',
    marca: 'string',
    capacidad: 'int',
    quantity: 'int'
  }
}

let ContractSchema = {
  name: 'Contract',
  primaryKey: '_id',
  properties:{
    _id: 'objectId',
    _partition: 'string',
    name: 'string',
    cantidad: 'string',
    product: 'string',
    user: 'string',
    duracion: 'int'
  }
}

// // // MODULE EXPORTS

const myPartitionKey = "myAppPartition"

let sync = {user: app.currentUser, partitionValue: myPartitionKey}

let config = {path: './data/blogs.realm', sync: sync, schema: [UserSchema, ApiVersionSchema, ProductSchema, ContractSchema]}

exports.getDB = async () => {
                              await app.logIn(new Realm.Credentials.anonymous())
                              return await Realm.open(config)
}

exports.partitionKey = myPartitionKey

exports.app = app

// // // // // 

  if (process.argv[1] == __filename){ //TESTING PART

    if (process.argv.includes("--create")){ //crear la BD
  
        Realm.deleteFile({path: './data/blogs.realm'}) //borramos base de datos si existe
  
        app.logIn(new Realm.Credentials.anonymous()).then(() => {
  
          let DB = new Realm({
            path: './data/blogs.realm',
            sync: sync,
            schema: [ProductSchema, UserSchema, ContractSchema, ApiVersionSchema]
          })
         
          DB.write(() => {
            let user = DB.create('User', {_id: ObjectId(), 
                                          _partition:myPartitionKey, 
                                          name:'user0', 
                                          passwd:'xxx'})
           
            let apiVersion = DB.create('Version', {
                                                  _id: ObjectId(), 
                                                  _partition:myPartitionKey, 
                                                  name: 'version de la api', 
                                                  version: '0.0'})
    
            let product = DB.create('Product', {
              _id: ObjectId(),
              _partition:myPartitionKey,
              name: 'Acer 26',
              category: 'Ordenador',
              marca: 'Acer',
              capacidad: 16,
              quantity: 10
            })
    
            let contract = DB.create('Contract', {
              _id: ObjectId(),
              _partition:myPartitionKey,
              name: 'Contrato-1',
              cantidad: '5',
              product: 'Acer 26',
              user: 'user0',
              duracion: 13
            })
    
            console.log('Inserted objects', user, apiVersion, product, contract)
          })
          DB.close()
  
        })
        .catch(err => console.log(err))
  
    }
  else { //consultar la BD

      Realm.open({ path: './data/blogs.realm' , sync: sync, schema: [UserSchema, ApiVersionSchema, ProductSchema, ContractSchema] }).then(DB => {
        let users = DB.objects('User')
        users.forEach(x => console.log(x.name, x._id))
        let apiVersion = DB.objects('Version')
        let product = DB.objects('Product')
        let contract = DB.objects('Contract')
        DB.close()
      })
  }
  
}
