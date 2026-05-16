import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  quarter: { type: String, enum: ['Q1', 'Q2', 'Q3', 'Q4'], required: true },
  actualAchievement: { type: Number, required: true },
  employeeComment: { type: String },
  managerComment: { type: String },
}, { timestamps: true });

export default mongoose.model('CheckIn', checkInSchema);
