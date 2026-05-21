const app = require('./app');
const sequelize = require('./config/db');

// require('./models/roomModel');
// require('./models/guestModel');
// require('./models/bookingModel');

sequelize.sync({alter:true})
.then(() => {

    console.log('Database connected');

    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });

})
.catch((err) => {
    console.log(err);
});