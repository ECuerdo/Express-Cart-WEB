const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set("view engine", "hbs");

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log("Connected to database...");
})

//Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.get("/index",function(req, res) {
    res.sendFile(__dirname + "/index.hbs");
});

// Log in
app.post("/auth/login", encoder, function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    db.query("SELECT * FROM user_info WHERE email = ?", [email], function (error, result) {
        if (error) {
            console.log(error);
        } else {
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (err, isMatch) => {
                    if (isMatch) {
                        res.redirect("/index");
                    } else {
                        res.render("login", { message: "Incorrect email or password" });
                    }
                });
            } else {
                res.render("login", { message: "User not found" });
            }
        }
    });
});

//change password
app.get('/changepassword', (req, res) => {
    res.render('changepassword');
});
app.post('/changepassword', (req, res) => {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Check if email is provided
    if (!email) {
        console.error('Email is missing in the request body.');
        return res.status(400).render('changepassword', { message: 'Invalid email.' });
    }

    // Debug: Log email to check its value
    console.log('Email received:', email);

    // Verify email exists
    db.query('SELECT * FROM user_info WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).render('changepassword', { message: 'Error occurred. Please try again later.' });
        }

        if (results.length === 0) {
            console.error('Email not found in the database:', email);
            return res.render('changepassword', { message: 'Email not found.' });
        }

        const user = results[0];

        // Verify old password
        bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).render('changepassword', { message: 'Error occurred. Please try again later.' });
            }

            if (!isMatch) {
                console.error('Old password is incorrect.');
                return res.render('changepassword', { message: 'Old password is incorrect.' });
            }

            // Verify new password and confirm password
            if (newPassword !== confirmPassword) {
                console.error('New passwords do not match.');
                return res.render('changepassword', { message: 'Passwords do not match.' });
            }

            // Hash the new password and update in the database
            bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Password hashing error:', err);
                    return res.status(500).render('changepassword', { message: 'Error occurred. Please try again later.' });
                }

                // Debug: Log hashed password
                console.log('Hashed password:', hashedPassword);

                // Update the password in the database
                db.query('UPDATE user_info SET password = ? WHERE email = ?', [hashedPassword, email], (error, results) => {
                    if (error) {
                        console.error('Database update error:', error);
                        return res.status(500).render('changepassword', { message: 'Error occurred. Please try again later.' });
                    }

                    console.log('Password updated successfully.');
                    return res.redirect('/login');
                });
            });
        });
    });
});

// Resetting Password using Username and Email from the database

// Route to render the reset password form
app.get('/resetpass', (req, res) => {
    res.render('resetpass'); // Assuming you have a template engine set up
});

// Route to handle reset password form submission
app.post('/resetpass', (req, res) => {
    const { user_name, email, newPassword, confirmPassword } = req.body;

    // Validate user_name and email
    db.query('SELECT * FROM user_info WHERE user_name = ? AND email = ?', [user_name, email], (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            return res.render('resetpass', { message: 'Invalid user_name or email.' });
        }

        // Verify new password and confirm password
        if (newPassword !== confirmPassword) {
            return res.render('resetpass', { message: 'Passwords do not match.' });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 8, (err, hashedPassword) => {
            if (err) throw err;

            // Update the password in the database
            db.query('UPDATE user_info SET password = ? WHERE user_name = ? AND email = ?', [hashedPassword, user_name, email], (error, results) => {
                if (error) throw error;

                res.render('resetpass', { message: 'Password reset successfully.' });
            });
        });
    });
});

// when login is successful
app.get("/index",function(req, res) {
    res.sendFile(__dirname + "/index.hbs");
});

// Port
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});