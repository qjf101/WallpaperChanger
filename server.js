const express = require('express');
const path = require('path');

const app = express();

const apiRoutes = require('./routes/api')

app.use('/api', apiRoutes);

app.use(express.static(path.resolve(__dirname,'./public')))

// app.get('/api/customers', (req, res) => {
//     const customers = [
//         {id: 1, firstName: 'John', lastname: 'Doe'},
//         {id: 2, firstName: 'Steve', lastname: 'Smith'},
//         {id: 3, firstName: 'Mary', lastname: 'Swanson'}
//     ];

//     res.json(customers);
// });

const port = 5000;

app.listen(port, () => console.log(`Server started on ${port}`));