const User = require('../models/User');


// Render Login/Signup Page
exports.getLoginSignup = (req, res) => {
    res.render('loginSignup', { error: null });
};

// Handle Signup
exports.signup = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, age, password } = req.body;

    // console.log(req.body);
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.render('loginSignup', { error: 'User already exists' });
        }

        // Create new user
        user = new User({ firstName, lastName, email, phoneNumber, age, password });
        await user.save();

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        res.render('loginSignup', { error: 'Signup failed, please try again.' });
    }
};

// Handle Login
exports.login = async (req, res) => {
    const { userCredential, password } = req.body;
    console.log(password);

    try {
        const user = await User.findOne({
            $or: [
                { email: userCredential },
                { phoneNumber: userCredential }
            ]
        });

        if (!user || !(await user.matchPassword(password))) {
            return res.render('loginSignup', { error: 'Invalid credentials' });
        }

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        res.render('loginSignup', { error: 'Login failed, please try again.' });
    }
};

// Handle Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};


// Function to save user location
exports.saveLocation = async (req, res) => {
    if(req.session.user){
        const { latitude, longitude } = req.body;
        const userId = req.session.user._id;  // Assuming session has user data
    
        try {
            // Update the user's location in the database
            await User.findByIdAndUpdate(userId, {
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]  // GeoJSON format: [longitude, latitude]
                }
            });
    
            res.json({ message: 'Location saved successfully' });
        } catch (error) {
            console.error('Error saving location:', error);
            res.status(500).json({ error: 'Failed to save location' });
        }
    }
    
    
};



