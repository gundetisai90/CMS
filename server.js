const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const adminRoutes = require('./routes/admin');
const indexRoutes = require('./routes/index');

const app = express();

// Database connection
mongoose.connect('mongodb+srv://saireddygundeti902:Reddysai9090@cluster0.5mesxbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({ secret: 'mySecret', resave: false, saveUninitialized: true }));

// Use routes
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
