var pgtools = require("pgtools");
const config = {
    user: process.env.USER || "postgress",
    host: process.env.HOST || "localhost",
    password: process.env.PASSWORD || "",
    port: process.env.PORT || 5432
}
const { db, User, Story } = require("./db");
const { USERS, STORIES } = require("./seed-data");

(async function seedDatabase() {
    try {
    //   await db.sync({ force: true });
    //   await Promise.all(seedData.map((contact) => Contact.create(contact)));
    //   console.log(`
    //     Seed success!
    //   `);

    //DROP DATABASE IF IT EXISTS
    await pgtools.dropdb(config, 'acme-writers-group', function (err, res){
       if(err && err.name && err.name !== 'invalid_catalog_name'){
           console.error(err)
       }
    });

    await pgtools.createdb(config, 'acme-writers-group', function (err, res){
        if(res){
            console.log("Successfully created the database 'acme-writers-group'")
        }
    })

    await db.sync({force: true})
    
    await Promise.all(USERS.map(user=> User.create(user)))
    await Promise.all(STORIES.map(story=> Story.create(story)))
    } catch (err) {
      console.error(err.stack);
    } finally {
      db.close();
    }
  })();