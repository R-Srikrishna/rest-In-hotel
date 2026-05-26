const app = require('./app');
const sequelize = require('./config/db');

// require('./models/roomModel');
// require('./models/guestModel');
// require('./models/bookingModel');

// Avoid automatic schema ALTERs at runtime; run migrations manually instead.
// Using `sync({ alter: true })` can issue many ALTER statements and
// fail on databases with existing conflicting indexes.
sequelize
    .sync()
    .then(() => {
        console.log('Database connected');

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Failed to connect to database:', err);
    });