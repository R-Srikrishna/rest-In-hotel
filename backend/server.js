require('dotenv').config({ path: './.env' });

const app = require('./app');
const sequelize = require('./config/db');
const Admin = require('./models/adminModel');
const Guest = require('./models/guestModel');

const PORT = process.env.PORT || 3000;

const seedDefaultUsers = async () => {
  try {
    // Create default Super Admin
    const adminExists = await Admin.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (!adminExists) {
      await Admin.create({
        firstName: 'System',
        lastName: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'super-admin',
      });

      console.log('✅ Default Super Admin created');
    }

    // Create default Guest
    const guestExists = await Guest.findOne({
      where: { email: 'guest@example.com' },
    });

    if (!guestExists) {
      await Guest.create({
        firstName: 'Demo',
        lastName: 'Guest',
        email: 'guest@example.com',
        password: 'Password123',
        phoneNumber: '1234567890',
      });

      console.log('✅ Default Guest created');
    }
  } catch (error) {
    console.error('Error while seeding default users:', error);
  }
};

const startServer = async () => {
  try {
    await sequelize.sync({ alter: true });

    console.log('✅ Database connected and synchronized');

    await seedDefaultUsers();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
