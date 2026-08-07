require('dotenv').config({ path: './.env' });
const app = require('./app');
const sequelize = require('./config/db');
const Admin = require('./models/adminModel');
const Guest = require('./models/guestModel');

const PORT = process.env.PORT || 3000;

const seedDefaultUsers = async () => {
  const adminExists = await Admin.findOne({ where: { email: 'admin@gmail.com' } });
  if (!adminExists) {
    await Admin.create({
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'super-admin',
    });
  }

  const guestExists = await Guest.findOne({ where: { email: 'guest@example.com' } });
  if (!guestExists) {
    await Guest.create({
      firstName: 'Demo',
      lastName: 'Guest',
      email: 'guest@example.com',
      password: 'Password123',
      phoneNumber: '1234567890',
    });
  }
};

sequelize
  .sync()
  .then(async () => {
    console.log('Database connected and synced');

    await seedDefaultUsers();
    console.log('Default demo users ready');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });
