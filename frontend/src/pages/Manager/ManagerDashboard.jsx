import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Users, CheckCircle, AlertCircle, Edit3, Lock, Target, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ManagerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ teamMembers: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);
  
  // Feedback state
  const [feedbackGoal, setFeedbackGoal] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ rating: 3, comment: '' });

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/manager/team-goals`, config);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load team data. (Did you restart the backend server?)');
      setLoading(false);
    }
  };

  const handleApprove = async (goalId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/goals/${goalId}/approve`, { approved: true, locked: true }, config);
      fetchTeamData();
    } catch (err) {
      setError('Failed to approve goal');
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/goals/${editingGoal._id}/approve`, { 
        weightage: editingGoal.weightage,
        target: editingGoal.target 
      }, config);
      setEditingGoal(null);
      fetchTeamData();
    } catch (err) {
      setError('Failed to update goal');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/manager/goals/${feedbackGoal._id}/feedback`, feedbackData, config);
      setFeedbackGoal(null);
      setFeedbackData({ rating: 3, comment: '' });
      fetchTeamData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getGoalsForEmployee = (employeeId) => data.goals.filter(g => g.employeeId._id === employeeId);

  // Chart Data preparation
  const chartData = data.teamMembers.map(member => {
    const memberGoals = getGoalsForEmployee(member._id);
    return {
      name: member.name.split(' ')[0],
      pending: memberGoals.filter(g => !g.approved).length,
      approved: memberGoals.filter(g => g.approved).length
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Header Card */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-[#0f172a] p-8 rounded-3xl relative overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>
          
          <div className="relative z-10 mb-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
              Team Overview
            </h1>
            <p className="text-slate-800 dark:text-slate-200 mt-2 text-lg font-bold transition-colors">Review, adjust, and approve performance objectives for your direct reports.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
             <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-inner transition-colors">
                <Users className="text-blue-700 dark:text-indigo-400" size={32} />
                <div>
                  <p className="text-sm text-slate-800 dark:text-slate-300 font-black uppercase tracking-wider mb-0.5">Team Size</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{data.teamMembers.length}</p>
                </div>
             </div>
             <div className="flex items-center gap-4 bg-amber-100 dark:bg-amber-900/50 px-6 py-4 rounded-2xl border border-amber-300 dark:border-amber-700 shadow-inner transition-colors">
                <AlertCircle className="text-amber-700 dark:text-amber-400" size={32} />
                <div>
                  <p className="text-sm text-amber-900 dark:text-amber-300 font-black uppercase tracking-wider mb-0.5">Pending Approvals</p>
                  <p className="text-3xl font-black text-amber-900 dark:text-amber-400 leading-none">{data.goals.filter(g => !g.approved).length}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl flex flex-col justify-center transition-colors duration-300">
           <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 text-center">Team Approval Status</h3>
           <div className="h-40 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="name" tick={{fontSize: 14, fill: 'currentColor', fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: 'black'}} />
                 <Bar dataKey="approved" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                 <Bar dataKey="pending" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/80 text-red-900 dark:text-red-100 p-4 rounded-xl text-base font-bold border-2 border-red-300 dark:border-red-700 flex gap-2 items-start transition-colors">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Team Members List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 dark:border-indigo-500"></div></div>
      ) : (
        <div className="space-y-8">
          {data.teamMembers.map(member => {
            const memberGoals = getGoalsForEmployee(member._id);
            const totalWeightage = memberGoals.reduce((sum, g) => sum + g.weightage, 0);
            
            return (
              <div key={member._id} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-none transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-6 border-b-2 border-slate-200 dark:border-slate-800 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-indigo-900 flex items-center justify-center text-blue-800 dark:text-indigo-300 border-2 border-blue-300 dark:border-indigo-600 transition-colors">
                      <Users size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">{member.name}</h2>
                      <p className="text-base font-bold text-slate-700 dark:text-slate-300 transition-colors">{member.email}</p>
                    </div>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 sm:text-right">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-300 uppercase tracking-wider mb-1">Total Weightage</p>
                    <p className={`text-4xl font-black ${totalWeightage === 100 ? 'text-emerald-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>{totalWeightage}%</p>
                  </div>
                </div>

                {memberGoals.length === 0 ? (
                  <div className="text-center py-8">
                     <Target className="mx-auto text-slate-400 dark:text-slate-600 mb-3" size={48} />
                     <p className="text-lg font-bold text-slate-700 dark:text-slate-400">This employee hasn't submitted any goals yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {memberGoals.map(goal => (
                      <div key={goal._id} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-300 dark:border-slate-600 relative group transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-4 py-1.5 text-sm font-black rounded-full border-2 ${
                            goal.approved ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-400 dark:border-green-600' : 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                          }`}>
                            {goal.approved ? 'Approved' : 'Pending'}
                          </span>
                          {!goal.approved && (
                            <button onClick={() => setEditingGoal(goal)} className="p-2 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:text-indigo-300 bg-white dark:bg-slate-700 rounded-lg shadow-sm border-2 border-slate-300 dark:border-slate-500 transition-all hover-lift">
                              <Edit3 size={20} />
                            </button>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-2 h-14 transition-colors">{goal.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 transition-colors">
                            <p className="text-xs text-slate-700 dark:text-slate-400 uppercase font-black tracking-wider">Target</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight mt-1">{goal.target} <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{goal.uom}</span></p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700 transition-colors">
                            <p className="text-xs text-blue-800 dark:text-indigo-400 uppercase font-black tracking-wider">Weightage</p>
                            <p className="text-2xl font-black text-blue-800 dark:text-indigo-300 leading-tight mt-1">{goal.weightage}%</p>
                          </div>
                        </div>

                        {!goal.approved ? (
                           <button 
                             onClick={() => handleApprove(goal._id)}
                             className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-black text-lg transition-all shadow-lg hover-lift"
                           >
                             <CheckCircle size={24} />
                             Approve & Lock
                           </button>
                        ) : (
                           <div className="space-y-3 mt-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                             <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-bold">
                               <div className="flex items-center gap-2"><Lock size={18} /> Locked</div>
                               <span>Achieved: <strong className="text-slate-900 dark:text-white">{goal.achievement}</strong></span>
                             </div>
                             {goal.feedback?.rating ? (
                               <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                 <div className="flex items-center gap-1 mb-1">
                                    {[1,2,3,4,5].map(star => (
                                      <span key={star} className={`text-sm ${star <= goal.feedback.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}>★</span>
                                    ))}
                                 </div>
                                 {goal.feedback.comment && <p className="text-sm text-slate-600 dark:text-slate-400 italic line-clamp-2">"{goal.feedback.comment}"</p>}
                               </div>
                             ) : (
                               <button 
                                 onClick={() => { setFeedbackGoal(goal); setFeedbackData({ rating: 3, comment: '' }); }}
                                 className="w-full flex items-center justify-center gap-2 py-3 bg-blue-100 hover:bg-blue-200 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/50 text-blue-800 dark:text-indigo-300 rounded-xl font-black transition-colors"
                               >
                                 <MessageSquare size={18} />
                                 Provide Feedback
                               </button>
                             )}
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => setFeedbackGoal(null)}></div>
          <div className="bg-white dark:bg-[#0f172a] border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="bg-blue-600 dark:bg-indigo-900 p-6 text-white border-b-2 border-transparent dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-black">Quarterly Feedback</h2>
              <p className="text-blue-100 dark:text-indigo-200 text-sm font-bold mt-1">Review {feedbackGoal.title}</p>
            </div>
            <form onSubmit={submitFeedback} className="p-8 space-y-6">
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Manager Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({...feedbackData, rating: star})}
                      className={`text-4xl transition-colors hover:scale-110 ${star <= feedbackData.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Comments (Optional)</label>
                <textarea 
                  rows="4" 
                  value={feedbackData.comment} 
                  onChange={e => setFeedbackData({...feedbackData, comment: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 outline-none transition-colors placeholder-slate-400"
                  placeholder="Provide constructive feedback..."
                ></textarea>
              </div>
              <div className="pt-6 flex gap-4 justify-end">
                <button type="button" onClick={() => setFeedbackGoal(null)} className="px-6 py-3 font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg transition-colors hover-lift">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => setEditingGoal(null)}></div>
          <div className="bg-white dark:bg-[#0f172a] border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="bg-slate-100 dark:bg-indigo-900 p-6 text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-black">Edit Goal Parameters</h2>
            </div>
            <form onSubmit={handleEditSave} className="p-8 space-y-6">
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Target ({editingGoal.uom})</label>
                <input required type="number" value={editingGoal.target} onChange={e => setEditingGoal({...editingGoal, target: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Weightage (%)</label>
                <input required type="number" min="10" max="100" value={editingGoal.weightage} onChange={e => setEditingGoal({...editingGoal, weightage: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 outline-none transition-colors" />
              </div>
              <div className="pt-6 flex gap-4 justify-end">
                <button type="button" onClick={() => setEditingGoal(null)} className="px-6 py-3 font-black text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg transition-colors hover-lift">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
