const express = require('express');

const { createUser, getUserStats } = require('../controllers/userController');
const { getLogs } = require('../controllers/logController');
const { startSimulation } = require('../controllers/simulationController');

const router = express.Router();

router.post('/users', createUser);
router.get('/users/:id', getUserStats);
router.get('/logs', getLogs);
router.post('/simulate', startSimulation);

router.get('/test', (req, res) => {
  res.send("Routes working");
});

module.exports = router;