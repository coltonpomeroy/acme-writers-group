const { faker } = require('@faker-js/faker');


const USERS = [];
const STORIES = [];

function createRandomUser(){
    return {
        name: faker.name.firstName(),
        bio: faker.lorem.paragraph()
    }
}

function createRandomStory(){
    return {
        title: faker.random.words(),
        body: faker.lorem.paragraphs(5),
        favorite: faker.datatype.boolean(),
        authorUserId: faker.random.numeric(2)
    }
}

Array.from({length: 100}).forEach(()=>USERS.push(createRandomUser()));
Array.from({length: 500}).forEach(()=>STORIES.push(createRandomStory()));

module.exports = { STORIES, USERS }