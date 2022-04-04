db.createUser(
  {
    user : "admin",
    pwd : "admin",
    roles : [
      {
        role : "readWrite",
        db : "mongodb"
      }
    ]
  }
)
printjson(db.insert({title: "Foo", category: "Bar"}))

