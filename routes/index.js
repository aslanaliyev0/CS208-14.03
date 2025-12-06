var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Downtown Donuts' });
});

router.get('/menu', function(req, res, next) {
  res.render('menu', { title: 'Menu · Downtown Donuts' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About · Downtown Donuts' });
});

router.get('/comments', function(req, res, next) {
  try {
    req.db.query(
      'SELECT name, message, DATE_FORMAT(created_at, "%Y-%m-%d") AS created_at FROM comments ORDER BY created_at DESC;',
      (err, results) => {
        if (err) {
          console.error('Error fetching comments:', err);
          return res.status(500).send('Error fetching comments');
        }
        res.render('comments', {
          title: 'Comments · Downtown Donuts',
          comments: results
        });
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
});

router.post('/comments', function(req, res, next) {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.redirect('/comments');
  }

  try {
    req.db.query(
      'INSERT INTO comments (name, message) VALUES (?, ?);',
      [name, message],
      (err, results) => {
        if (err) {
          console.error('Error adding comment:', err);
          return res.status(500).send('Error adding comment');
        }
        res.redirect('/comments');
      }
    );
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Error adding comment');
  }
});

module.exports = router;
