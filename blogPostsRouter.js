const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
		"In Church",
		"I love the church: its labara," +
		"its silver vessels, its candleholders," +
		"the lights, the ikons, the pulpit." +			 
		"Whenever I go there, into a church of the Greeks," +
		"with its aroma of incense," +
		"its liturgical chanting and harmony," +
		"the majestic presence of the priests," +
		"dazzling in their ornate vestments," +
		"the solemn rhythm of their gestures—" +
		"my thoughts turn to the great glories of our race," +
		"to the splendor of our Byzantine heritage.",
		"C.P. Cavafy"
	);

BlogPosts.create(
		"This is the title",
		"Hold fast to dreams" +
		"For if dreams die" +
		"Life is a broken-winged bird" +
		"That cannot fly." +
		"Hold fast to dreams" +
		"For when dreams go" +
		"Life is a barren field" +
		"Frozen with snow.",
		"Langston Hughes"
	);

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Message \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(
		req.body.title, req.body.content, req.body.author);
	res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = [
			'id', 'title', 'content', 'author', 'publishDate'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = (
			`Request path id (${req.params.id}) and request body id`
			`(${req.body.id}) must watch`);
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post with id \`${req.params.id}\``);
	const updateItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post with id \`${req.params.ID}\``);
	res.status(204).end();
});

module.exports = router;