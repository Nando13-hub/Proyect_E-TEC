const { graphql, buildSchema } = require('graphql')

const model = require('./model') //Database

let DB
model.getDB().then(db => {DB=db})


const sse  = require('./utils/notifications') //Notifications
sse.start()


const schema = buildSchema(`
  type Query {
    hello: String
    users: [User]
    blogs: [Blog]
    apiVersion: [Version]
    searchBlog(q:String!):[Blog]
    posts(blogId:ID!):[Post]
    searchPost(blogId:ID!, q:String!):[Post]
  }
  type Mutation {
    addUser(name:String!):User!
    addBlog(title:String!,creator:ID!):Blog!
    addPost(title:String!,content:String!,authorId:ID!,blogId:ID!):Post
  }
  type User{
	name: String
  }

  type Post{
	title: String
	content: String
	author: User
	blog: Blog
  }
  type Blog{
	creator: User
	title: String
  }

  type Version{
    version: String
  }
`)


const rootValue = {
     hello : () => "Hello World!",
     users : () => DB.objects('User'),
     blogs:  () => DB.objects('Blog'),
     searchBlog: ({ q }) => {
       q = q.toLowerCase()
       return DB.objects('Blog').filter(x => x.title.toLowerCase().includes(q))
     },
     posts: ({ blogId }) => {
       return DB.objects('Post').filter(x => x.blog.title == blogId)
     },
     addPost: ({title, content, authorId, blogId}) => {

       let post = null
       let blog = DB.objectForPrimaryKey('Blog', blogId)
       let auth = DB.objectForPrimaryKey('User', authorId)
       
       if (blog && auth){
          let data = {
                       title: title,
                       content: content,
                       author: auth,
                       blog: blog,
                       timestamp: new Date()
                      }

          DB.write( () => { post = DB.create('Post', data) }) 

          // SSE notification
          sse.emitter.emit('new-post', data)
       }
       
       return post
     },
     
     apiVersion: () => DB.objects('Version')
}

exports.root   = rootValue
exports.schema = schema
exports.sse    = sse