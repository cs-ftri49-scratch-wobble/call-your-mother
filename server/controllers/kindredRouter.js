const express = require('express');
const router = express.Router();
const kindredController = require('./KindredController'); // Adjust the path as necessary

//create kindred
router.post('/kindred', kindredController.createKindred);

//get kindred
router.get('/kindred/:name', kindredController.findKindred);

//delete kindred
router.delete(
  '/kindred/:name',
  kindredController.findKindred,
  kindredController.deleteKindred
);

//add date to kindred, then send back health
router.post(
  '/kindred/:name/addDate',
  kindredController.findKindred,
  kindredController.addDate,
  kindredController.getHealth
);

//get health of kindred
router.get(
  '/kindred/:name/getHealth',
  kindredController.findKindred,
  kindredController.getHealth
);

module.exports = router;
