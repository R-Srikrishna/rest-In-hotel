require('dotenv').config({ path: './.env' });
const app = require('./app');
const sequelize = require('./config/db');

// require('./models/roomModel');
// require('./models/guestModel');
// require('./models/bookingModel');

sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synced');

    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });
