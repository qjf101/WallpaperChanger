const express = require('express');
const path = require('path');

const app = express();

const apiRoutes = require('./routes/api')

app.use('/api', apiRoutes);

app.use(express.static(path.resolve(__dirname,'./public')))

const port = 5000;

app.listen(port, () => console.log(`Server started on ${port}`));