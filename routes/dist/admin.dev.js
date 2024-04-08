"use strict";

var express = require('express');

var multer = require('multer');

var router = express.Router();

var Page = require('../models/Page');

var Admin = require('../models/Admin');

var path = require('path');

var fs = require('fs'); // Set up storage engine


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});
var upload = multer({
  storage: storage
}); // Add a new page (form)

router.get('/pages/new', function (req, res) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  res.render('admin/new-page');
}); // Post route to create a new page (with image upload)
// Post route to create a new page (with image upload)

router.post('/pages', upload.single('image'), function _callee(req, res) {
  var _req$body, title, content, slug, image, newPage;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.session.adminId) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.redirect('/admin/login'));

        case 2:
          _req$body = req.body, title = _req$body.title, content = _req$body.content, slug = _req$body.slug;
          image = '';

          if (req.file) {
            image = req.file.path.substring(req.file.path.indexOf('/uploads'));
          }

          _context.prev = 5;
          newPage = new Page({
            title: title,
            content: content,
            slug: slug,
            image: image
          });
          _context.next = 9;
          return regeneratorRuntime.awrap(newPage.save());

        case 9:
          res.redirect('/admin/addsubmit'); // Redirect to addsubmit after successful creation

          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](5);
          console.log(_context.t0);
          res.render('admin/new-page', {
            error: 'Error creating the page'
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 12]]);
}); // Route for the addsubmit page

router.get('/addsubmit', function (req, res) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  res.render('admin/addsubmit');
});
router.get('/login', function (req, res) {
  res.render('admin/login');
});
router.post('/login', function _callee2(req, res) {
  var _req$body2, username, password, admin;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Admin.findOne({
            username: username
          }));

        case 3:
          admin = _context2.sent;

          if (admin && password === admin.password) {
            req.session.adminId = admin._id;
            res.redirect('/admin/welcome');
          } else {
            res.send('Invalid credentials');
          }

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //admin welcome page

router.get('/welcome', function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (req.session.adminId) {
            _context3.next = 2;
            break;
          }

          return _context3.abrupt("return", res.redirect('/admin/login'));

        case 2:
          try {
            res.render('admin/welcome');
          } catch (error) {
            console.log(error);
            res.redirect('/admin/login');
          }

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // Admin dashboard route

router.get('/dashboard', function _callee4(req, res) {
  var pages;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.session.adminId) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return", res.redirect('/admin/login'));

        case 2:
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Page.find());

        case 5:
          pages = _context4.sent;
          res.render('admin/dashboard', {
            pages: pages
          });
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](2);
          console.log(_context4.t0);
          res.redirect('/admin/login');

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 9]]);
}); // Edit page route (display form with current page data)

router.get('/pages/edit/:id', function _callee5(req, res) {
  var page;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.session.adminId) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return", res.redirect('/admin/login'));

        case 2:
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(Page.findById(req.params.id));

        case 5:
          page = _context5.sent;

          if (page) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.status(404).send('Page not found'));

        case 8:
          res.render('admin/edit-page', {
            page: page
          });
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](2);
          console.log(_context5.t0);
          res.redirect('/admin/dashboard');

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 11]]);
}); // Update page route (handle page data and image upload)

router.post('/pages/edit/:id', upload.single('image'), function _callee6(req, res) {
  var page, _req$body3, title, content, slug, imagePath;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (req.session.adminId) {
            _context6.next = 2;
            break;
          }

          return _context6.abrupt("return", res.redirect('/admin/login'));

        case 2:
          _context6.prev = 2;
          _context6.next = 5;
          return regeneratorRuntime.awrap(Page.findById(req.params.id));

        case 5:
          page = _context6.sent;

          if (page) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.status(404).send('Page not found'));

        case 8:
          _req$body3 = req.body, title = _req$body3.title, content = _req$body3.content, slug = _req$body3.slug;
          imagePath = page.image;

          if (req.file) {
            if (page.image && fs.existsSync("./public".concat(page.image))) {
              // Delete the old image
              fs.unlinkSync("./public".concat(page.image));
            }

            imagePath = req.file.path.substring(req.file.path.indexOf('/uploads'));
          }

          _context6.next = 13;
          return regeneratorRuntime.awrap(Page.findByIdAndUpdate(req.params.id, {
            title: title,
            content: content,
            slug: slug,
            image: imagePath
          }));

        case 13:
          res.redirect('/admin/dashboard');
          _context6.next = 20;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](2);
          console.log(_context6.t0);
          res.redirect('/admin/dashboard');

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[2, 16]]);
}); // Delete page route
// Delete page route
// Delete page route updated to use findByIdAndDelete

router.post('/pages/delete/:id', function _callee7(req, res) {
  var page;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (req.session.adminId) {
            _context7.next = 2;
            break;
          }

          return _context7.abrupt("return", res.redirect('/admin/login'));

        case 2:
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(Page.findById(req.params.id));

        case 5:
          page = _context7.sent;

          if (page) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).send('Page not found'));

        case 8:
          if (page.image && fs.existsSync("./public".concat(page.image))) {
            // Delete the image associated with the page
            fs.unlinkSync("./public".concat(page.image));
          }

          _context7.next = 11;
          return regeneratorRuntime.awrap(Page.findByIdAndDelete(req.params.id));

        case 11:
          res.redirect('/admin/deletesubmit'); // Redirect to the deletesubmit page

          _context7.next = 18;
          break;

        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](2);
          console.log(_context7.t0);
          res.redirect('/admin/dashboard');

        case 18:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 14]]);
}); // Route for deletesubmit page

router.get('/deletesubmit', function (req, res) {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  res.render('admin/deletesubmit'); // Ensure this EJS file exists in your views/admin directory
});
router.get('/logout', function (req, res) {
  // Destroy the session and log out the user
  if (req.session) {
    req.session.destroy(function (err) {
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
}); // Route for logoutsubmit page

router.get('/logoutsubmit', function (req, res) {
  res.render('admin/logoutsubmit'); // Make sure you have logoutsubmit.ejs in your views/admin directory
});
module.exports = router;