const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name_us: { type: String },
    password_us: { type: String, required: true },
    user_name_us: { type: String, required: true },
    image_us: { type: String, default: 'user_default.png' },
    email_us: { type: String, required: true, unique: true },
    phone_us: { type: Number },
    address_us: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetPasswordToken: { type: String, default: null }, 
});

module.exports = mongoose.model('users', usersSchema);
