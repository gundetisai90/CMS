"use strict";

var express = require('express');

var router = express.Router();

var Page = require('../models/Page'); // Route to render the homepage with a list of all pages


router.get('/', function _callee(req, res) {
  var pages;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Page.find());

        case 3:
          pages = _context.sent;
          res.render('index', {
            pages: pages
          }); // pages is passed here

          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('Error fetching pages:', _context.t0);
          res.status(500).send('Error loading pages');

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get('/about', function (req, res) {
  res.render('about'); // This will render views/about.ejs
});
router.get('/teams', function (req, res) {
  res.render('teams'); // This will render views/teams.ejs
});
router.get('/contact', function (req, res) {
  res.render('contact'); // This will render views/contact.ejs
}); // Route to render individual pages based on slug

router.get('/page/:slug', function _callee2(req, res) {
  var page, pages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Page.findOne({
            slug: req.params.slug
          }));

        case 3:
          page = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Page.find());

        case 6:
          pages = _context2.sent;

          if (page) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).send('Page not found'));

        case 9:
          res.render('page', {
            page: page,
            pages: pages
          }); // Pass pages here

          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.log('Error finding the page:', _context2.t0);
          res.status(500).send('Error loading the page');

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
router.use(function _callee3(req, res, next) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Page.find());

        case 3:
          res.locals.pages = _context3.sent;
          next();
          _context3.next = 11;
          break;

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          console.log('Error fetching pages:', _context3.t0);
          next(_context3.t0);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;