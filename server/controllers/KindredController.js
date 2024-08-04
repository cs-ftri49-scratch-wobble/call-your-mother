const mongoose = require('mongoose');
const Kindred = require('../models/KindredModel');

//mongoose array methods: .push to add documents for nested schemas, .isMongooseArray to check if pushable
//https://masteringjs.io/tutorials/mongoose/array#document-arrays

const kindredController = {};

//creates kindred. user provides name in request body
kindredController.createKindred = async (req, res, next) => {
  const { kindredName, date } = req.body;
  if (!kindredName) {
    return next({
      log: 'Name needed.',
      status: 400,
      message: { err: 'Kindred name not provided' },
    });
  }
  try {
    const kindred = await Kindred.create({
      kindredName: kindredName,
    });
    res.status(200).json(`Kindred created: ${kindred}`);
  } catch (err) {
    next({
      log: 'Error creating kindred',
      status: 500,
      message: { err: 'Internal Server Error' },
    });
  }
};

//finds kindred. this middleware is used right before the updating middleware
//router.get('/kindred/:kindredName', kindredController.findKindred)
(kindredController.findKindred = async (req, res, next) => {
  try {
    const { kindredName } = req.params;
    if (!kindredName) {
      return next({
        log: 'Kindred name needed.',
        status: 400,
        message: { err: 'Kindred name not provided.' },
      });
    }
    const kindred = await Kindred.findOne({
      kindredName: kindredName,
    });
    if (!kindred) {
      return next({
        log: 'Kindred not found',
        status: 404,
        message: { err: 'Kindred document not found.' },
      });
    }
    res.locals.kindred = kindred;
    return next();
  } catch (err) {
    next({
      log: 'Error finding kindred',
      status: 500,
      message: { err: 'Internal Server Error' },
    });
  }
}),
  //deletes kindred. user provides name in request body
  //app.delete('/kindred/:kindredName', kindredController.findKindred, kindredController.deleteKindred);
  (kindredController.deleteKindred = async (req, res, next) => {
    const kindred = res.locals.kindred;
    try {
      await Kindred.deleteOne({ _id: kindred._id });
      res.status(200).json({
        message: `${kindred.kindredName} profile deleted.`,
      });
    } catch (err) {
      next({
        log: 'Error deleting kindred',
        status: 500,
        message: { err: 'Internal Server Error' },
      });
    }
  });

//adds Date to kindred, also calculates health and returns it
//router.post('/kindred/:kindredName/updateHealth', kindredController.findKindred, kindredController.addDate, kindredController.updateHealth);
kindredController.addDate = async (req, res, next) => {
  const { date } = req.body;
  if (!date) {
    return next({
      log: 'Date required.',
      status: 400,
      message: { err: 'Date not provided.' },
    });
  }
  try {
    const objDate = new Date(date);
    res.locals.kindred.date = objDate;
    await res.locals.kindred.save(); //https://mongoosejs.com/docs/documents.html
    return next();
  } catch (err) {
    next({
      log: 'Error adding date to kindred',
      status: 500,
      message: { err: 'Internal Server Error' },
    });
  }
};

//calculate health
//to decide where health score goes after
kindredController.calcHealth = async (req, res, next) => {
  const date = res.locals.kindred.date;
  try {
    const dateNow = new Date();
    const daysDiff = (dateNow - date) / 86400000; //diff between two Dates: https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    let health;
    if (daysDiff <= 7) health = 3;
    if (daysDiff > 7 && daysDiff <= 14) health = 2;
    if (daysDiff > 14 && daysDiff <= 28) health = 1;
    if (daysDiff > 28) health = 0;
    res.locals.kindred.health = health;
    await res.locals.kindred.save(); //https://mongoosejs.com/docs/documents.html
    return next(); //to decide where health score goes after
  } catch (err) {
    next({
      log: 'Error calculating health',
      status: 500,
      message: { err: 'Internal Server Error' },
    });
  }
};

//Stretch
//within function to add events to Kindred
//get particularKindred using Kindred.find(`identifier`)
// particularKindred.events.push({
//   eventName: eventName,
//   eventDate: eventDate,
//   eventDescription: eventDescription,
// })
