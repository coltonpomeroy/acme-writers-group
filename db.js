const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme-writers-group')

const User = db.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    bio: {
        type: Sequelize.TEXT
    }
});

const Story = db.define('stories', {
    title: {
        type: Sequelize.STRING
    },
    body: {
        type: Sequelize.TEXT
    },
    favorite: {
        type: Sequelize.BOOLEAN
    },
    authorUserId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
});

User.hasMany(Story);

module.exports = {
    db,
    Story,
    User
}