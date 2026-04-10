const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Signup for admin
exports.signup = async (req, res) => {
    const { team_code, full_name, title, email, role, password } = req.body;

    if (!team_code || !full_name || !email || !role || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            team_code,
            full_name,
            title,
            email,
            role,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Generate token for auto-login after signup
        const token = newUser.generateAuthToken();

        return res.status(201).json({ 
            message: 'User registered successfully',
            token, 
            user: { 
                userID: newUser._id,
                team_code: newUser.team_code,
                email: newUser.email, 
                role: newUser.role,
                full_name: newUser.full_name 
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error in signup'});
    }
};


// Login for admin and member
exports.login = async (req, res) => {
    const { email, team_code, password, role } = req.body;

    if (!email || !team_code || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Convert role to lowercase for case-insensitive comparison
        const user = await User.findOne({ 
            $and: [
                { email: email.toLowerCase() }, 
                { team_code }, 
                { role: role.toLowerCase() }  // Convert role to lowercase
            ] 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        res.json({ token, user: { 
            userID: user._id,
            team_code: user.team_code,
            email: user.email, 
            role: user.role,
            full_name: user.full_name 
        }});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};