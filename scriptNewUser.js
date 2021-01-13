const mongoose = require('mongoose');
const User = require('./models/user');

try{
mongoose.connect('mongodb://127.0.0.1:27017/restAPI', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
"auth": {
      		"authSource": "admin"
    	},
    	"user": "ProxiviaAdmin",
    	"pass": "V79cV''3V]NULf`F_"
});
} catch (error) {
	console.log(error)
}
const createNewUser = async () => {
  const newUser = await new User({
    firstname: 'admin',
    lastname: 'admin',
    email: 'newadmin@admin.eu',
    password: 'admin',
    resetPasswordToken: '',
    address: "38 cours de l'intendance",
    city: 'Bordeaux',
    phone: '0647670997',
    postal: '33000',
    country: 'France',
    avatar: '',
    token: [],
    prospects: [],
    company: null,
    completedProfil: true,
    document: [],
    about: '',
    trainings: [],
    experiences: 0,
    role: 'admin',
  });
  await newUser.save();
};

try {
createNewUser();
} catch (error)
 {
	console.log(error);
}
