const express = require('express');
const app = express();
const userRouter = require('./userRouter');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors')

// app.get('/', (req, res) => {
// 	res.send('Form Validation is Running')
// })

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use('/api', userRouter);




app.listen(2020, () => {
	console.log("server running on 2020 ");
})
mongoose.connect('mongodb://localhost:27017/userAuth',
	{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
		console.log("Server Connected Successfully");
	});