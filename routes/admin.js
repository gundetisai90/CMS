const express = require('express');
const multer = require('multer');
const router = express.Router();
const Page = require('../models/Page');
const Admin = require('../models/Admin');
const path = require('path');
const fs = require('fs');


// Set up storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

// Add a new page (form)
router.get('/pages/new', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    res.render('admin/new-page');
});

// Post route to create a new page (with image upload)
// Post route to create a new page (with image upload)
router.post('/pages', upload.single('image'), async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    
    const { title, content, slug } = req.body;
    let image = '';
    if (req.file) {
        image = req.file.path.substring(req.file.path.indexOf('/uploads'));
    }

    try {
        const newPage = new Page({ title, content, slug, image });
        await newPage.save();
        res.redirect('/admin/addsubmit'); // Redirect to addsubmit after successful creation
    } catch (error) {
        console.log(error);
        res.render('admin/new-page', { error: 'Error creating the page' });
    }
});

// Route for the addsubmit page
router.get('/addsubmit', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    res.render('admin/addsubmit');
});



router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username: username });

    if (admin && password === admin.password) {
        req.session.adminId = admin._id;
        res.redirect('/admin/welcome');
    } else {
        res.send('Invalid credentials');
    }
});
//admin welcome page
router.get('/welcome', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }

    try {
       
        res.render('admin/welcome');
    } catch (error) {
        console.log(error);
        res.redirect('/admin/login');
    }
});

// Admin dashboard route
router.get('/dashboard', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }

    try {
        const pages = await Page.find();
        res.render('admin/dashboard', { pages });
    } catch (error) {
        console.log(error);
        res.redirect('/admin/login');
    }
});



// Edit page route (display form with current page data)
router.get('/pages/edit/:id', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }

    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).send('Page not found');
        }
        res.render('admin/edit-page', { page: page });
    } catch (error) {
        console.log(error);
        res.redirect('/admin/dashboard');
    }
});

// Update page route (handle page data and image upload)
router.post('/pages/edit/:id', upload.single('image'), async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }

    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).send('Page not found');
        }

        const { title, content, slug } = req.body;
        let imagePath = page.image;

        if (req.file) {
            if (page.image && fs.existsSync(`./public${page.image}`)) {
                // Delete the old image
                fs.unlinkSync(`./public${page.image}`);
            }
            imagePath = req.file.path.substring(req.file.path.indexOf('/uploads'));
        }

        await Page.findByIdAndUpdate(req.params.id, { title, content, slug, image: imagePath });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error);
        res.redirect('/admin/dashboard');
    }
});

// Delete page route
// Delete page route
// Delete page route updated to use findByIdAndDelete
router.post('/pages/delete/:id', async (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }

    try {
        const page = await Page.findById(req.params.id);
        if (!page) {
            return res.status(404).send('Page not found');
        }

        if (page.image && fs.existsSync(`./public${page.image}`)) {
            // Delete the image associated with the page
            fs.unlinkSync(`./public${page.image}`);
        }

        await Page.findByIdAndDelete(req.params.id);
        res.redirect('/admin/deletesubmit'); // Redirect to the deletesubmit page
    } catch (error) {
        console.log(error);
        res.redirect('/admin/dashboard');
    }
});

// Route for deletesubmit page
router.get('/deletesubmit', (req, res) => {
    if (!req.session.adminId) {
        return res.redirect('/admin/login');
    }
    res.render('admin/deletesubmit'); // Ensure this EJS file exists in your views/admin directory
});


router.get('/logout', (req, res) => {
    // Destroy the session and log out the user
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                // handle error case...
                console.error(err);
                res.status(500).send('Could not log out, please try again.');
            } else {
                // Redirect to the logout submit page or login page
                res.redirect('/admin/logoutsubmit');
            }
        });
    } else {
        // if session doesn't exist, just redirect
        res.redirect('/admin/login');
    }
});

// Route for logoutsubmit page
router.get('/logoutsubmit', (req, res) => {
    res.render('admin/logoutsubmit'); // Make sure you have logoutsubmit.ejs in your views/admin directory
});


module.exports = router;
