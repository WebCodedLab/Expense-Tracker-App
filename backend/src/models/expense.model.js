import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other']
    },
    description: { 
        type: String,
        maxlength: 200
    },
    spentBy: {
        type: String,
        required: true,
        enum: ['Zohaib', 'Shoaib', 'Sohaib', 'Other']
    },
    date: { 
        type: Date, 
        default: Date.now,
        required: true
    },
    isPlanned: { 
        type: Boolean, 
        default: false 
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurrenceInterval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', null],
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes for better query performance
expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ user: 1, category: 1 });

export default mongoose.model("Expense", expenseSchema);
