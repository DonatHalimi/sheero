const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    profilePicture: {
        type: String,
        default: function () {
            const color = '#7C7164';
            const letter = this.firstName.charAt(0).toUpperCase();
            return `https://dummyimage.com/100x100/${color.slice(1)}/ffffff&text=${letter}`;
        }
    }
});

// Change profilePicture text on first name change
userSchema.pre('save', function (next) {
    if (this.isModified('firstName')) {
        const color = '#7C7164';
        const letter = this.firstName.charAt(0).toUpperCase();
        this.profilePicture = `https://dummyimage.com/100x100/${color.slice(1)}/ffffff&text=${letter}`;
    }
    next();
});

userSchema.methods.updateProfilePicture = async function (newPictureUrl) {
    this.profilePicture = newPictureUrl;
    await this.save();
};

module.exports = mongoose.model('User', userSchema);