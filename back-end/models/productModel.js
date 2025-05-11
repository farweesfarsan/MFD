const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Product Name"],
        trim: true,
        maxLeangth: [100, "Product Charector cannot exceed 100"]
    },
    price: {
        type: Number,
        default:0.0
    },
    
    description:{
        type: String,
        required:[true, "Please Enter Product Description"]
    },

    ratings: {
        type: String,
        default:0
    },

    image:{
        type:String,
    },

    category: {
        type: String,
        required:[true, "Please Enter Categoey"],
        enum: {
            values: [
                'Milk',
                'Curd',
                'Ice-Cream',
                'Panneer',
                'Yoghurt',
                'Ghee',
                'Butter',
                'Yoghurt Drink'
            ]
        },
        message:"Please Selecet a Category"
    },

    stock: {
        type:Number,
        required:[true,"Please Enter Product Stock"],
        maxLeangth:[20,"Product Stock cannot exceed 20"]
    },

    numOfReviews: {
        type:Number,
        default:0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    

    user:{
        type: mongoose.Schema.Types.ObjectId
   },

    createdAt:{
        type: Date,
        default: Date.now()

    }
});

let product = mongoose.model('Product',productSchema);

module.exports = product;