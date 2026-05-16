import express from 'express';
import Goal from '../models/Goal.js';
import User from '../models/User.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/manager/team-goals
// @desc    Get all goals for the manager's team
router.get(`${API}/api/manager/team-goals`, protect, manager, async (req, res) => {
  try {
    // Find all users who report to this manager
    const teamMembers = await User.find({ managerId: req.user._id }).select('name email role department');
    const teamMemberIds = teamMembers.map(member => member._id);

    // Find all goals belonging to these team members
    const goals = await Goal.find({ employeeId: { $in: teamMemberIds } }).populate('employeeId', 'name email');
    
    res.json({
      teamMembers,
      goals
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/manager/goals/:id/approve
// @desc    Approve/Reject or edit weightage/target of a goal
router.put('/goals/:id/approve', protect, manager, async (req, res) => {
  try {
    const { approved, locked, target, weightage, status } = req.body;
    
    const goal = await Goal.findById(req.params.id).populate('employeeId');
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    // Verify the goal belongs to a team member
    if (goal.employeeId.managerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to approve this goal' });
    }

    if (target !== undefined) goal.target = target;
    if (weightage !== undefined) goal.weightage = weightage;
    if (approved !== undefined) goal.approved = approved;
    if (locked !== undefined) goal.locked = locked;
    if (status !== undefined) goal.status = status;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/manager/goals/:id/feedback
// @desc    Submit Quarterly Feedback (rating and optional comment)
router.put('/goals/:id/feedback', protect, manager, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const goal = await Goal.findById(req.params.id).populate('employeeId');
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    // Verify the goal belongs to a team member
    if (goal.employeeId.managerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to review this goal' });
    }

    if (!goal.approved) {
      return res.status(400).json({ message: 'Cannot provide feedback on unapproved goals' });
    }

    goal.feedback = {
      rating: Number(rating),
      comment: comment || ''
    };

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
