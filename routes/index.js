const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

// Route to render the homepage with a list of all pages
router.get('/', async (req, res) => {
    try {
        const pages = await Page.find();
        res.render('index', { pages: pages }); // pages is passed here
    } catch (error) {
        console.log('Error fetching pages:', error);
        res.status(500).send('Error loading pages');
    }
});
router.get('/about', (req, res) => {
    res.render('about'); // This will render views/about.ejs
});

router.get('/teams', (req, res) => {
    res.render('teams'); // This will render views/teams.ejs
});

router.get('/contact', (req, res) => {
    res.render('contact'); // This will render views/contact.ejs
});

// Route to render individual pages based on slug
router.get('/page/:slug', async (req, res) => {
    try {
        const page = await Page.findOne({ slug: req.params.slug });
        const pages = await Page.find(); // Fetch all pages for navigation
        if (!page) {
            return res.status(404).send('Page not found');
        }
        res.render('page', { page: page, pages: pages }); // Pass pages here
    } catch (error) {
        console.log('Error finding the page:', error);
        res.status(500).send('Error loading the page');
    }
});

router.use(async (req, res, next) => {
    try {
        res.locals.pages = await Page.find();
        next();
    } catch (error) {
        console.log('Error fetching pages:', error);
        next(error);
    }
});

module.exports = router;
