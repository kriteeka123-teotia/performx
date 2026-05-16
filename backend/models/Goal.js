import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  uom: { type: String, enum: ['Numeric', '%', 'Timeline', 'Zero-based'], required: true },
  target: { type: Number, required: true },
  weightage: { type: Number, required: true, min: 10 },
  status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  approved: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  sharedGoal: { type: Boolean, default: false },
  achievement: { type: Number, default: 0 },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
