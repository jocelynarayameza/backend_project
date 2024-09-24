import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    isGitHub: {
        type: Boolean,
        default: false
    },
    carts: {
        type: Schema.Types.ObjectId,
        ref: 'carts',
        default: []
    },
    last_connection: {
        type: Date,
        default: Date.now
    }

});

export const UserModel = model('users', UserSchema);