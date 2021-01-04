const { Router, request, response } = require('express');
const { connection } = require('../db_connection');

const router = Router();

/* GET index page. */
router.get('/', (request, response) => {
  response.json({
    title: 'My favorites boardgames'
  });
});

module.exports = router;