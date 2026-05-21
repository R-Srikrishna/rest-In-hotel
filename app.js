const express = require('express');
const path = require('path');
const roomRoutes = require('./routes/roomroute');
const guestRoutes = require('./routes/guestsroute');
const bookingRoutes = require('./routes/bookingroute');

const app = express();

app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.json());

app.use('/rooms', roomRoutes);
app.use('/guests',guestRoutes);
app.use('/bookings',bookingRoutes);

module.exports = app;