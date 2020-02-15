const User = require('../models/user.model');
const Token = require('../models/token.model');
const Passhash = require('password-hash')


exports.signup = async (req, res) => {
    var user = new User({
        email: req.body.email,
        password: Passhash.generate(req.body.password),
        name: req.body.name
    });

    user = await user.save();
    var token = new Token({ userid: user._id })
    token = await token.save();
    res.header('authentication', token._id);
    res.status(200).send(user);
}

exports.signin = async (req, res) => {

    var user = await User.findOne({ email: req.body.email })
    console.log(user);
    if (!user) {
        res.send("Email do not exist")
    }
    else {
        console.log(Passhash.verify(req.body.password, user.password))
        if (Passhash.verify(req.body.password, user.password)) {
            var token = new Token({ userid: user._id })
            token = await token.save();
            res.header('authentication', token._id);
            res.status(200).send(user)
        }
        else {
            res.send('invalid username or password')
        }
    }

}

exports.retrieveuser = async (req, res) => {

    var user = await User.findById(req.userid);
    if (!user)
        res.send('user not found');
    else
        res.status(200).send(user);
    //TODO
}

exports.signout = async (req, res) => {
    var token = await Token.findByIdAndDelete(req.token._id);
    console.log(token);
    res.status(200).send({ message: "Signout success" });
}

exports.signoutall = async (req, res) => {
    // Remove all tokens associated with the userId
    var tokens = await Token.deleteMany({ userId: req.token.userId });
    console.log(tokens);
    res.status(200).send({ message: "Signout all success" });
};
