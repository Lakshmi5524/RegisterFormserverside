const router = require('express').Router();
const User = require('./userSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



router.post('/register', async (req, res) => {

	try {
		var emailExist = await User.findOne({ email: req.body.email });
		if (emailExist) {
			return res.status(400).json('Email already exist');
		}
		var hash = await bcrypt.hash(req.body.password, 10);

		//password Hash
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hash,

		});
		var dada = await user.save();
		res.json(dada);
	} catch (err) {
		res.status(400).json(err);
	}
	res.json(user)
});

router.post('/login', async (req, res) => {
	try {
		var userData = await User.findOne({ email: req.body.email });
		if (!userData) {
			return res.status(400).json('Email already exist');
		}
		var validPsw = await bcrypt.compare(req.body.password, userData.password);
		if (!validPsw) {
			return res.status(400).json("possword  not valid");
		}

		var userToken = await jwt.sign({ email: userData.email }, 'secret');

		res.header('auth', userToken).json(userToken)
	} catch (err) {
		res.status(400).json(err);
	}
});

const validUser = (req, res, next) => {
	var token = req.header('auth');
	req.token = token;
	next();
}
router.get('/getAll', validUser, async (req, res) => {
	jwt.verify(req.token, 'secret', async (err, data) => {
		if (err) {
			res.sendStatus(403)
		} else {
			const data = await User.find().select(['-password']);
			res.json(data);
		}
	});

})
module.exports = router;