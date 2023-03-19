const { version } = require('graphql')
const Realm = require('realm')

let UserSchema = {
   name: 'User',
   primaryKey: 'name',
   properties: {
      name: 'string',
      passwd: 'string',
   }
}

let PostSchema = {
  name: 'Post',
  primaryKey: 'title',
  properties: {
    timestamp: 'date',
    title: 'string', 
    content: 'string',
    author: 'User',
    blog: 'Blog'
  }
}

let BlogSchema = {
  name : 'Blog',
  primaryKey: 'title',
  properties:{
     title: 'string',
     creator: 'User' //esto es una referencia a un usuario
   }
}

let ApiVersionSchema = {
  name : 'Version',
  primaryKey: 'name',
  properties:{
     name: 'string',
     version: 'string'
   }
}

let ProductSchema = {
  //id
  name: 'Product',
  primaryKey: 'name',
  properties:{
    name: 'string',
    category: 'string',
    marca: 'string',
    capacidad: 'int',
    quantity: 'int'
  }
}

let ContractSchema = {
  name: 'Contract',
  primaryKey: 'name',
  properties:{
    name: 'string',
    cantidad: 'string',
    product: 'string',
    user: 'string',
    duracion: 'int'
  }
}

// // // MODULE EXPORTS

let config = {path: './data/blogs.realm', schema: [PostSchema, UserSchema, BlogSchema, ApiVersionSchema, ProductSchema]}

exports.getDB = async () => await Realm.open(config)

// // // // // 

if (process.argv[1] == __filename){ //TESTING PART

  if (process.argv.includes("--create")){ //crear la BD

      Realm.deleteFile({path: './data/blogs.realm'}) //borramos base de datos si existe

      let DB = new Realm({
        path: './data/blogs.realm',
        schema: [PostSchema, UserSchema, BlogSchema, ApiVersionSchema, ProductSchema]
      })
     
      DB.write(() => {
        let user = DB.create('User', {name:'user0', passwd:'xxx'})
        
        let blog = DB.create('Blog', {title:'Todo Motos', creator: user})
        
        let post = DB.create('Post', {
                                        title: 'prueba moto', 
                                        blog:blog, 
                                        content: 'esto es una prueba de motos',
                                        creator: user, 
                                        timestamp: new Date()})

        let apiVersion = DB.create('Version', {name: 'version de la api', version: '0.0'})

        let product = DB.create('Product', {
          name: 'Acer 26',
          category: 'Ordenador',
          marca: 'Acer',
          capacidad: 16,
          quantity: 10
        })

        console.log('Inserted objects', user, blog, post, apiVersion, product)
      })
      DB.close()

  }
  else { //consultar la BD

      Realm.open({ path: './data/blogs.realm' , schema: [PostSchema, UserSchema, BlogSchema, ApiVersionSchema, ProductSchema] }).then(DB => {
        let users = DB.objects('User')
        users.forEach(x => console.log(x.name))
        let blog = DB.objectForPrimaryKey('Blog', 'Todo Motos')
        let apiVersion = DB.objects('Version', '0.0')
        let product = DB.objects('Product')
        if (blog)
           console.log(blog.title, 'by', blog.creator.name)
        DB.close()
      })
  }
  
}
