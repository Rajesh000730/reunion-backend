const assert = require('assert');
const { MongoClient } = require('mongodb');
// const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../app');
const request = require('supertest').agent('http://localhost:3000');
const { schema, model } = require('mongoose');
const User  = require('../models/users.model');
const Post  = require('../models/posts.model');
const { doesNotMatch } = require('assert');


// check if the server is running
describe('checking server connection', () => {
    it('should return 200', (done) => {
        request
        .get('/')
        .expect(200, done);
    });
    });

// check mongoose connection
describe('checking Mongoose connection', () => {
    it('should return connected', (done) => {
        request
        .get('/')
        .expect(200, done);
    });
    }   
);
    
// check if the user can be created
describe('checking if the user can be created', () => {
    it('should return 200', (done) => {
        const user = new User({
            name: "rajesh",
            email: "dummy@gmail.com",
            password: "dummy",
        });
        user.save().then((user) => {
            assert(!user.isNew);
            done();
        }
        );

    });
    after(async () => {
        await User.deleteOne({email: "dummy@gmail.com"});
    });
    
    }
);



//check if the "/api" endpoint is protected
describe('is /api Protected?', () => {
    it('should return 401', (done) => {
        request
        .get('/api')
        .expect(401, done);
    });
    }
);

//check if the user can create a post after authentication at "/api/authenticate"
describe('checking if the user can create a post after authentication', () => {
       it('should return 200', (done) => {
          let token
          request
          .post('/api/authenticate')
            .send({
                email:"rajesh@gmail.com",
                password:"rajesh"
            })
            .end((err, response) => {
                token = response.body.token;
                request
                .auth(token, {type: 'bearer'})
                .post('/api/posts')
                .send({
                    title: "dummy",
                    description: "dummy",
                    date: Date.now()
                })
                .expect(200, done);
            }
            );
        });
        after(async () => {
            await Post.deleteOne({title: "dummy"});
         });

    
    }
);



//check if error is thrown when the user misses the title field
describe('checking if error is thrown when the user misses the title field', () => {
    it('should return 400', (done) => {
        let token
        request
        .post('/api/authenticate')
          .send({
              email:"rajesh@gmail.com",
                password:"rajesh"
            })
            .end((err, response) => {
                token = response.body.token;
                request
                .auth(token, {type: 'bearer'})
                .post('/api/posts')
                .send({

                    description: "dummy",
                    date: Date.now()
                })
                .expect(400, done);
            }
            );
        });
       
    
    }
);





