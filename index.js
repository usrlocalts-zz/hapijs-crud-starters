'use strict';

const Hapi = require('hapi');
const joi = require("joi");

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});


var posts = [
  {
    id: 1,
    title: 'The Puissant Beast', content: 'Whilst I stand on the footplate of arguably one of the classic superfasts of India'
  }
  ,
  {
    id: 2,
    title: 'Authentication Token Mechanism', content: 'Recently, I got a chance to setup a authentication token mechanism on our middleware, which purely exposes REST API\’s.'
  }
  ,
  {
    id: 3,
    title: 'Playing with Apache URL Rewrites', content: 'URL Rewriting is one of the interesting concepts that can be employed to improve usability, cleanliness of URLs and also to filter out unwanted URLs at the server level. '
  }
  ,
  {
    id: 4,
    title: 'It’s not hosting, it\’s hoisting!', content: 'Developers often get confused with JavaScript scoping. As JavaScript resembles languages like C, it is often assumed it behaves the same way.'
  }
];

// Add the route
server.route({
  method: 'GET', path: '/posts', handler: function (request, response) {
    response(posts);
  }
});

server.route({
  method: 'GET', path: '/posts/{id}', handler: function (request, response) {
    if (request.params.id) {
      var post = posts.filter(function (obj) {
        return obj.id == request.params.id;
      });
      post.length === 0 ? response('No posts found') : response(post[0]);
    }
  }
});

server.route({
  method: 'POST', path: '/posts', config: {
    handler: function (request, response) {
      var id = posts.length==0 ? 1: posts[posts.length-1].id+1;
      var post = {
        id: id, title: request.payload.title, content: request.payload.content
      };
      posts.push(post);
      response(post).code(201);
    }, validate: {
      payload: {
        title: joi.string().required(), content: joi.string().required()
      }
    }
  }
});

server.route({
  method: 'PUT', path: '/posts/{id}', config: {
    handler: function (request, response) {
      if (request.params.id) {
        var post = posts.filter(function (obj) {
            if (obj.id.toString() === request.params.id) {
              obj.title = request.payload.title;
              obj.content = request.payload.content;
            }
            return obj.id == request.params.id;
          }
        );
        post.length === 0 ? response('No posts found') : response(post[0]);
      }
      else {
        response('ID missing');
      }
    }
  }
});

server.route({
  method: 'DELETE', path: '/posts/{id}', config: {
    handler: function (request, response) {
      var message = "No posts found.";
      if (request.params.id) {
        posts.filter(function (obj, index) {
            if (obj.id.toString() === request.params.id) {
              posts.splice(index, 1);
              message = 'Post deleted';
            }
          }
        );
        response(message);
      }
      else {
        response('ID missing');
      }
    }
  }});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});