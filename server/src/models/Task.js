const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Subtask title is required'],
      trim: true,
      maxlength: [120, 'Subtask title cannot exceed 120 characters']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'in_review', 'completed'],
        message: '{VALUE} is not a valid task status'
      },
      default: 'todo'
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'urgent'],
        message: '{VALUE} is not a valid priority level'
      },
      default: 'medium'
    },
    category: {
      type: String,
      trim: true,
      default: 'General'
    },
    dueDate: {
      type: Date,
      default: null
    },
    subtasks: [subtaskSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A task must belong to a user'],
      index: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Compound Indexes (ESR Rule - Equality, Sort, Range)
 * Drastically accelerates common queries filtering by user + status or sorting by due date
 */
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
