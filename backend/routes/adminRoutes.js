import express from 'express';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get high-level statistics for the admin dashboard
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGoals = await Goal.countDocuments();
    const approvedGoals = await Goal.countDocuments({ approved: true });
    
    // Calculate global completion (using 'Completed' status or achievement logic)
    const completedGoals = await Goal.countDocuments({ status: 'Completed' });

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);

    // Leaderboard Calculation
    const allCompletedGoals = await Goal.find({ status: 'Completed' }).populate('employeeId', 'name department');
    const leaderboardMap = {};
    allCompletedGoals.forEach(g => {
      if (!g.employeeId) return;
      const empId = g.employeeId._id.toString();
      if (!leaderboardMap[empId]) {
        leaderboardMap[empId] = { id: empId, name: g.employeeId.name, department: g.employeeId.department, score: 0 };
      }
      leaderboardMap[empId].score += g.weightage;
    });
    const leaderboard = Object.values(leaderboardMap).sort((a, b) => b.score - a.score).slice(0, 5);

    res.json({
      totalUsers,
      totalGoals,
      approvedGoals,
      completedGoals,
      recentUsers,
      leaderboard
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/admin/export
// @desc    Export all goals and users to CSV
router.get('/export', protect, admin, async (req, res) => {
  try {
    const goals = await Goal.find().populate('employeeId', 'name email department role');
    
    if (!goals || goals.length === 0) {
      return res.status(404).json({ message: 'No data found to export' });
    }

    // Define CSV Headers
    let csvString = "Goal ID,Goal Title,Status,Approved,Weightage,Target,Achievement,Employee Name,Employee Email,Department,Role,Manager Rating,Manager Comment\n";

    // Populate Rows
    goals.forEach(goal => {
      const emp = goal.employeeId;
      if (!emp) return; // Skip if user was deleted
      
      const safeTitle = `"${goal.title.replace(/"/g, '""')}"`;
      const safeComment = goal.feedback?.comment ? `"${goal.feedback.comment.replace(/"/g, '""')}"` : '""';
      
      csvString += `${goal._id},${safeTitle},${goal.status},${goal.approved},${goal.weightage},${goal.target},${goal.achievement},${emp.name},${emp.email},${emp.department},${emp.role},${goal.feedback?.rating || ''},${safeComment}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('PerformX_System_Report.csv');
    res.send(csvString);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
