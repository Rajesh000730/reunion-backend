const {Schema, model} = require('mongoose');
const postSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{type: String}],
    likes: {
        type: Number,
        default: 0
    }
});
module.exports = model('Post', postSchema);
