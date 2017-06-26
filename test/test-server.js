const chai = require('chai');
const chaiHttp = require('chai-http');

// call chai BDD style should for chainable language to construct assertions //
const should = chai.should();

// object destructering - doing it this way is shorter than adding .js at the end of .../server.js //
const {app, runServer, closeServer} = require('../server');

// this test targets the app's HTTP layer //
// able to use chai.request(server) //   ask Ben for better explanation 
chai.use(chaiHttp);

describe('Blog Posts', function() {

	// activate server, imediately invoked function returns a promise
	// promise is returned. if the promise isn't returned, tests might run before server is started
	before(function() {
		return runServer();
	});

	// close server after test run in case other test modules need to call runServer
	// if it's already running, runServer will error out
	after(function() {
		return closeServer();
	});

	// return chai.request(app) because it's an asynchronous operation
	// use promise instead of .done because you can chain promises together, return the values +
	// easier to understand
	// below is a mixture of promises chaining and testing with chai chaining
	it('should list items on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.above(0);
			res.body.forEach(function(item) {
				item.should.be.a('object');
				item.should.have.all.keys(
					'id', 'title', 'content', 'author', 'publishDate')
			});
		});
	});

	it('should add a blog post on POST', function() {
		const newPost = {
			title: 'Lorem ip some',
			content: 'foo foo foo foo',
			author: 'Emma Goldman'
		};

		// expectedKeys concats id and publish adds it to newPost object 
		// expect = {["id", "publishDate", "title", "content", "author"]}
		const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

		return chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.have.all.keys(expectedKeys);
			res.body.title.should.equal(newPost.title);
			res.body.content.should.equal(newPost.content);
			res.body.author.should.equal(newPost.author)
		});
	});

	it('should update blog posts on PUT', function() {

		return chai.request(app)
		// get in order to update //
		// can't update if you don't have access to it //
		.get('/blog-posts')
		.then(function(res) {
			// use ES6 Object.assign to assign new title and content
			const updatedPost = Object.assign(res.body[0], {
				title: 'connect the dots',
				content: 'la la la la la'
			});
			return chai.request(app)
			put(`/blog-posts/${res.body[0].id}`)
			.send(updatedPost)
			.then(function(res) {
				res.should.have.status(204);
			});
		});
	});

	it('should delete posts on DELETE', function() {
		return chai.request(app)
		// get in order to delete //
		// can't update if you don't have access to it //
		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
			.delete(`/blog-posts/${res.body[0].id}`)
			.then(function(res) {
				res.should.have.status(204);
			});
		});
	});
});