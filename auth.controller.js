const User = require('../models/user.model');

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        const newUser = new User({ name, email, password }); // Note: Password should be hashed in production
        await newUser.save();

        // Sanitize response
        const userResponse = { id: newUser._id, name: newUser.name, email: newUser.email };

        res.status(201).json({ message: 'User registered successfully', user: userResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error registering user' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });

        // Check finding user and matching password
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Sanitize response
        const userResponse = { id: user._id, name: user.name, email: user.email };

        res.status(200).json({ message: 'Login successful', user: userResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error logging in user' });
    }
};
