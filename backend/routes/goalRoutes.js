import express from 'express';
import Goal from '../models/Goal.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/goals
// @desc    Create a new goal
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, uom, target, weightage } = req.body;
    
    // Validations: Max 8 goals
    const goalCount = await Goal.countDocuments({ employeeId: req.user._id });
    if (goalCount >= 8) {
      return res.status(400).json({ message: 'Maximum of 8 goals allowed.' });
    }

    // Weightage validation is normally done on frontend too, but we enforce min 10 here
    if (weightage < 10) {
      return res.status(400).json({ message: 'Minimum weightage per goal is 10%.' });
    }

    const goal = await Goal.create({
      employeeId: req.user._id,
      title,
      description,
      uom,
      target,
      weightage
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/goals
// @desc    Get all goals for logged in employee
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ employeeId: req.user._id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal (before submission/approval)
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    if (goal.employeeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (goal.locked) {
      return res.status(400).json({ message: 'Cannot edit a locked goal' });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/goals/:id/progress
// @desc    Update achievement and status of an approved/locked goal
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { achievement, status } = req.body;
    
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    
    if (goal.employeeId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Only allow updating achievement and status
    if (achievement !== undefined) goal.achievement = achievement;
    if (status !== undefined) goal.status = status;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
