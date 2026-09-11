const mongoose = require('mongoose');
const Task = require('../models/Task');

/**
 * @desc    Get dashboard analytics & aggregated metrics for authenticated user
 * @route   GET /api/dashboard/stats
 * @access  Private
 * 
 * Uses an optimized MongoDB Aggregation Pipeline with $facet to compute
 * multi-dimensional statistics (status breakdown, priority distribution, overdue tasks)
 * in a SINGLE database round-trip.
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const now = new Date();

    const [aggregatedData] = await Task.aggregate([
      // Step 1: Filter strictly to authenticated user's tasks
      { $match: { user: userId } },

      // Step 2: Multi-faceted parallel aggregation
      {
        $facet: {
          // Total task count
          totalCount: [{ $count: 'count' }],

          // Group by status: todo, in_progress, in_review, completed
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],

          // Group by priority: low, medium, high, urgent
          byPriority: [
            { $group: { _id: '$priority', count: { $sum: 1 } } }
          ],

          // Count overdue tasks (dueDate < now and not completed)
          overdueCount: [
            {
              $match: {
                dueDate: { $ne: null, $lt: now },
                status: { $ne: 'completed' }
              }
            },
            { $count: 'count' }
          ],

          // Last 5 recently updated tasks
          recentActivity: [
            { $sort: { updatedAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                title: 1,
                status: 1,
                priority: 1,
                category: 1,
                updatedAt: 1
              }
            }
          ]
        }
      }
    ]);

    // Format status counts into a clean dictionary
    const statusMap = {
      todo: 0,
      in_progress: 0,
      in_review: 0,
      completed: 0
    };
    if (aggregatedData?.byStatus) {
      aggregatedData.byStatus.forEach((item) => {
        if (item._id && statusMap.hasOwnProperty(item._id)) {
          statusMap[item._id] = item.count;
        }
      });
    }

    // Format priority counts into a clean dictionary
    const priorityMap = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    if (aggregatedData?.byPriority) {
      aggregatedData.byPriority.forEach((item) => {
        if (item._id && priorityMap.hasOwnProperty(item._id)) {
          priorityMap[item._id] = item.count;
        }
      });
    }

    const total = aggregatedData?.totalCount?.[0]?.count || 0;
    const overdue = aggregatedData?.overdueCount?.[0]?.count || 0;
    const completed = statusMap.completed || 0;

    // Calculate completion percentage
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        inProgress: statusMap.in_progress,
        todo: statusMap.todo,
        inReview: statusMap.in_review,
        overdue,
        completionRate,
        byStatus: statusMap,
        byPriority: priorityMap,
        recentActivity: aggregatedData?.recentActivity || []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
