const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    username: {
            type: String,
            unique: [true, 'The login is unique']
           
    },
    email: {
            type: String,
            unique: [true, 'The email is unique'],
            required: [true, 'The email is required']
           
    },
    password: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', AdminSchema);