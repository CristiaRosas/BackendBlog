import  { Schema, model } from 'mongoose';

const commentSchema = new Schema({
    author: {
        type: String,
        required: [true, 'Author is required'],
        maxLength: [100, "Max length is 100 characters"],
    },
    
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        maxLength: [5000, "Max length is 5000 characters"],
    },

    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: [true, 'Publication is required'],
    },
    
    status: {
        type: Boolean,
        default: true,
    }

}, {
    timestamps: true,
    versionKey: false,  
});

export default model('Comment', commentSchema);