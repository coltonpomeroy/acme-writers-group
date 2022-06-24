const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { db, Story, User } = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware
app.use(morgan('dev'));

// Body parsing middleware
app.use(express.json());

// Static middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    user ? res.json(user) : res.sendStatus(404);
  } catch (err) {
    next(err);
  }
});

app.get('/api/users/:id/stories', async (req, res, next) => {
  try {
    const stories = await Story.findAll({
        where:{
            authorUserId: req.params.id
        }
    })
    res.json(stories)
  } catch (err) {
    next(err);
  }
});

app.post('/api/users', async(req, res, next) => {
    try{
        const user = await User.create(req.body)
        res.send(user, 204);
    }catch(e){
        console.error({route: `/api/users`, errorMessage: e.message, stack: e.stack})
        res.send(`User couldn't be created.`, 500)
    }
});

app.delete('/api/users/:id', async (req, res, next) => {
    try{
        const user = await User.findByPk(req.params.id)
        user.destroy()
        res.sendStatus(200)
    }catch(e){
        console.error({route: `/api/users/${req.params.id}`, errorMessage: e.message, stack: e.stack})
        res.send(`User couldn't be deleted.`, 500)
    }
});

app.post('/api/users/:id/stories', async (req, res, next) => {
    try{
        const payload = {...req.body, authorUserId: req.params.id}
        const story = await Story.create(payload)
        res.send(story, 204);
    }catch(e){
        console.error({route: `api/users/${req.params.id}/stories`, errorMessage: e.message, stack: e.stack})
        res.send(`Story couldn't be created.`, 500)
    }
    
});

app.delete('/api/stories/:id', async (req, res, next) => {
    try{
        const story = Story.findByPk(req.params.id);
        story.destroy()
        res.sendStatus(200)
    }catch(e){
        console.error({route: `/api/stories/${req.params.id}`, errorMessage: e.message, stack: e.stack})
        res.send(`Story couldn't be deleted`, 500)
    }
});

// Handle 404s
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling endware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Internal server error');
});

(async function startServer() {
  try {
    await db.sync();
    console.log('The database is synced!');
    app.listen(PORT, () =>
      console.log(`
        Listening on port ${PORT}
        http://localhost:3000/
      `)
    );
  } catch (err) {
    console.error(err);
  }
})();