const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v && v.length === 4;
      },
      message: 'Exactly 4 options are required'
    }
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer is required'],
    min: 0,
    max: 3,
    validate: {
      validator: function(v) {
        return Number.isInteger(v) && v >= 0 && v <= 3;
      },
      message: 'Correct answer must be between 0 and 3'
    }
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [180, 'Duration cannot exceed 180 minutes'],
    default: 30
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: ['Programming', 'Mathematics', 'Science', 'History', 'Geography', 'Language', 'Technology', 'Business', 'Other']
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

quizSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Quiz', quizSchema);