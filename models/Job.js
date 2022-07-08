const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title:{
        type: String,
        required :[true,"Please enter title for the gig"]
    },
    description:{
        type: String,
        required :[true,"Please enter description"]
    },
    price:{
        type: Number,
        required :[true,"Please set price for gig"]
    },
    image:{
        public_id: String,
        url: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    reviews:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            review: {
                type: String,
                required: true,
            }
        },
    ],
    bids:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            bid: {
                type: String,
                required: true,
            }
        },
    ],
});

module.exports = mongoose.model("Job",jobSchema);