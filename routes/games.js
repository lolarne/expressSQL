const { Router, request, response } = require('express');
const { connection } = require('../db_connection');

const router = Router();

//get - all data from table
router.get('/', (request, response) => {
  const sql = "SELECT * FROM favorite_boardgames";
  connection.query(sql, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'Cannot get the games.' });
    } else {
      response.status(200).json(results);
    }
  });
});

//get - specific fields (id, name, dates...)
router.get('/:name', (request, response) => {
  const sql = "SELECT * FROM favorite_boardgames WHERE name=?"
  connection.query(sql, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'This game is not on the list.' });
    } else {
      response.status(200).json(results);
    }
  });
});

//get - data that contains... ('ing'...)
router.get('/:type', (request, response) => {
  const sql = `SELECT * FROM favorite_boardgames WHERE type LIKE '%{$request.params.type}%'`;
  connection.query(sql, [request.params.type, request.body], (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: `There is no game with type: ${request.params.type}.` });
    } else {
      response.status(200).json(results);
    }
  });
});

//get - data starts with... ('campus'...)
router.get('/start/:name', (request, response) => {
  const sql = `SELECT * FROM favorite_boardgames WHERE type LIKE '{$request.params.name}%'`;
  connection.query(sql, [request.params.name, request.body], (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: `There is no game with type: ${request.params.name}.` });
    } else {
      response.status(200).json(results);
    }
  });
});

//get - data greater than... (<18/10/2010...)
router.get('/:date', (request, response) => {
  const sql = "SELECT * FROM favorite_boardgames WHERE date <= '?'";
  connection.query(sql, [request.body, request.params.date], (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: `There is no game created after this date: ${request.params.date}` });
    } else {
      response.status(200).json(results);
    }
  });
});

//get - ordered data (asc, desc) ROUTE PARAMETER (/data/parameter)
router.get('/asc', (request, response) => {
  const sql = "SELECT * FROM favorite_boardgames ORDER BY date ASC";
  connection.query(sql, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'error to order ASC the date of the games' });
    } else {
      response.status(200).json(results);
    }
  })
})

//post - insert new entity
router.post('/addGame', (request, response) => {
  const sql = "INSERT INTO favorite_boardgames SET ?";
  connection.query(sql, req.body, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'Sorry, cannot add the game' });
    } else {
      response.status(201).json({ id: results.insertId, ...request.body });
    }
  });
});

//put - modify an entity
router.put('/:id', (request, response) => {
  let sql = "UPDATE favorite_boardgames SET ? WHERE id=?";
  connection.query(sql, [request.body, request.params.id], (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'Error to update the game' });
    } else {
      sql = "SELECT * FROM favorite_boardgames WHERE id=?";
      connection.query(sql, request.params.id, (err, results) => {
        if (results.length === 0) {
          response.status(404).send({ errorMessage: `No game found with this id: ${request.params.id}` });
        } else {
          response.status(200).json(results[0]);
        }
      });
    }
  });
});

//put - change boolean value
// router.put('/kids/:id', (request, response)=>{
//   let sql = "UPDATE favorite_boardgames SET ? WHERE id=?";
//   connection.query(sql, [request.body, request.params.id], (err, results)=>{
//     if(err){
//       response.status(500).send({errorMessage: 'Error to update the game'});
//     }else{
//       sql = "SELECT * FROM favorite_boardgames WHERE id=?";
//       connection.query(sql, request.params.id, (err, results)=>{
//         if(results.length === 0){
//           response.status(404).send({errorMessage: `No game found with this id: ${request.params.id}`});
//         }else{
//           response.status(200).json(results[0]);
//         }
//       });
//     }
//   });
// });


//delete - an entity
router.delete('/delete/:id', (request, response) => {
  const sql = "DELETE FROM favorite_boardgames WHERE id=?";
  connection.query(sql, request.params.id, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: `Could not delete this game id: ${request.params.id}` });
    } else {
      response.sendStatus(200);
    }
  });
});

//delete - all false boolean
router.delete('/deletefalse/:id', (request, response) => {
  const sql = "DELETE FROM favorite_boardgames WHERE board = 0";
  connection.query(sql, request.params.id, (err, results) => {
    if (err) {
      response.status(500).send({ errorMessage: 'Sorry could not delete the game without board' });
    } else {
      response.sendStatus(200);
    }
  })
})

module.exports = router;