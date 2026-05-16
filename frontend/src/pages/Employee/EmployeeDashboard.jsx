import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Plus, Target, Clock, CheckCircle, AlertCircle, Lock, Edit2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  
  const [newGoal, setNewGoal] = useState({
    title: '', description: '', uom: 'Numeric', target: '', weightage: 10
  });

  // Progress Update State
  const [progressGoal, setProgressGoal] = useState(null);
  const [progressData, setProgressData] = useState({ achievement: 0, status: 'On Track' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('${import.meta.env.VITE_API_URL}/api/goals', config);
      setGoals(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const totalWeightage = goals.reduce((sum, g) => sum + g.weightage, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalWeightage + Number(newGoal.weightage) > 100) {
      return setError(`Cannot exceed 100% total weightage. You currently have ${totalWeightage}%.`);
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${import.meta.env.VITE_API_URL}/api/goals`, newGoal, config);
      setShowModal(false);
      setNewGoal({ title: '', description: '', uom: 'Numeric', target: '', weightage: 10 });
      fetchGoals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create goal');
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/goals/${progressGoal._id}/progress`, progressData, config);
      setProgressGoal(null);
      fetchGoals();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update progress. (Did you restart the backend?)');
    }
  };

  // Chart Data
  const chartData = [
    { name: 'Allocated', value: totalWeightage },
    { name: 'Remaining', value: 100 - totalWeightage }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Section: Header & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Header Card */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-[#0f172a] p-8 rounded-3xl relative overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 dark:bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>
          
          <div className="relative z-10 mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
                My Goals
              </h1>
              <p className="text-slate-800 dark:text-slate-200 mt-2 text-lg font-medium transition-colors">Track and manage your performance objectives for the quarter.</p>
            </div>
            
            {goals.length > 0 && totalWeightage === 100 && goals.every(g => g.status === 'Completed') && (
              <div className="bg-gradient-to-r from-amber-200 to-yellow-400 dark:from-yellow-600 dark:to-amber-500 text-yellow-900 dark:text-white px-4 py-2 rounded-2xl font-black shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center gap-2 animate-bounce">
                <span className="text-2xl">🏆</span>
                <span>Top Performer!</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
             <button 
                onClick={() => setShowModal(true)}
                disabled={goals.length >= 8 || totalWeightage >= 100}
                className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1"
              >
                <Plus size={24} />
                Create Goal
             </button>
             <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-inner transition-colors">
                <Target className="text-blue-700 dark:text-indigo-300" size={28} />
                <div>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-black uppercase tracking-wider mb-0.5">Goals Set</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{goals.length} <span className="text-base font-bold text-slate-600 dark:text-slate-400">/ 8</span></p>
                </div>
             </div>
          </div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center transition-colors duration-300">
           <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Weightage Allocation</h3>
           <div className="h-40 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   innerRadius={45}
                   outerRadius={65}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} className="fill-blue-700 dark:fill-indigo-500" fill={index === 0 ? 'currentColor' : 'var(--tw-colors-slate-300)'} />
                   ))}
                 </Pie>
                 <Tooltip formatter={(value) => `${value}%`} contentStyle={{fontWeight: 'bold', color: 'black'}} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className={`text-3xl font-black ${totalWeightage === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{totalWeightage}%</span>
             </div>
           </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 p-4 rounded-xl text-base font-bold border-2 border-red-300 dark:border-red-700 flex gap-2 items-start transition-colors">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 dark:border-indigo-500"></div></div>
      ) : goals.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center border-solid border-2 border-slate-400 dark:border-slate-600 transition-colors">
          <div className="bg-blue-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm dark:shadow-[0_0_30px_rgba(79,70,229,0.4)]">
            <Target className="text-blue-700 dark:text-indigo-300" size={32} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Goals Yet</h3>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300 max-w-md mx-auto">Get started by creating your first performance goal for this quarter. Remember, total weightage must equal 100%.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 hover-lift relative overflow-hidden group border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-indigo-400 transition-colors shadow-md dark:shadow-none flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-indigo-500 dark:to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-4 py-1.5 text-sm font-black rounded-full border-2 ${
                    goal.approved ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-400 dark:border-green-600' : 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600'
                  }`}>
                    {goal.approved ? 'Approved' : 'Pending Approval'}
                  </span>
                  {goal.locked && <Lock size={20} className="text-slate-600 dark:text-slate-400" title="Goal Locked" />}
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2 transition-colors">{goal.title}</h3>
                <p className="text-base font-bold text-slate-700 dark:text-slate-300 line-clamp-2 mb-6 h-12 transition-colors">{goal.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-600 transition-colors">
                    <p className="text-xs text-slate-700 dark:text-slate-300 uppercase font-black tracking-wide">Target ({goal.uom})</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{goal.target}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-indigo-900/40 rounded-xl p-4 border-2 border-blue-200 dark:border-indigo-700 transition-colors">
                    <p className="text-xs text-blue-800 dark:text-indigo-300 uppercase font-black tracking-wide">Weightage</p>
                    <p className="text-2xl font-black text-blue-800 dark:text-indigo-200 mt-1">{goal.weightage}%</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-5 flex flex-col gap-3 transition-colors mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {goal.status === 'Completed' ? <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} /> : 
                     goal.status === 'On Track' ? <Clock className="text-blue-600 dark:text-indigo-400" size={20} /> : 
                     <AlertCircle className="text-slate-600 dark:text-slate-400" size={20} />}
                    <span className="text-base font-black text-slate-800 dark:text-slate-200">{goal.status}</span>
                  </div>
                  <div className="text-base text-slate-700 dark:text-slate-300 font-bold">
                    Achieved: <span className="font-black text-slate-900 dark:text-white text-xl ml-1">{goal.achievement}</span>
                  </div>
                </div>

                {goal.approved && (
                  <button 
                    onClick={() => { setProgressGoal(goal); setProgressData({ achievement: goal.achievement, status: goal.status === 'Not Started' ? 'On Track' : goal.status }); }}
                    className="w-full mt-2 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-colors border-2 border-slate-200 dark:border-slate-600"
                  >
                    <Edit2 size={16} /> Update Progress
                  </button>
                )}
                
                {goal.feedback?.rating && (
                  <div className="mt-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manager Feedback</p>
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={`text-lg ${star <= goal.feedback.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-700'}`}>★</span>
                      ))}
                    </div>
                    {goal.feedback.comment && (
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">"{goal.feedback.comment}"</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Update Modal */}
      {progressGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => setProgressGoal(null)}></div>
          <div className="bg-white dark:bg-[#0f172a] border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 text-slate-900 dark:text-white border-b-2 border-slate-300 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-black">Update Progress</h2>
            </div>
            <form onSubmit={handleUpdateProgress} className="p-8 space-y-6">
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Current Achievement</label>
                <div className="flex items-center gap-4">
                  <input required type="number" min="0" value={progressData.achievement} onChange={e => setProgressData({...progressData, achievement: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 outline-none transition-colors" />
                  <span className="text-xl font-black text-slate-500">/ {progressGoal.target}</span>
                </div>
              </div>
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Status</label>
                <select value={progressData.status} onChange={e => setProgressData({...progressData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 outline-none transition-colors">
                  <option value="Not Started">Not Started</option>
                  <option value="On Track">On Track</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="pt-6 flex gap-4 justify-end">
                <button type="button" onClick={() => setProgressGoal(null)} className="px-6 py-3 font-black text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg transition-colors hover-lift">Save Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="bg-white dark:bg-[#0f172a] border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 transition-colors">
            <div className="bg-blue-700 dark:bg-indigo-900 p-6 text-white border-b-2 border-transparent dark:border-slate-700 transition-colors">
              <h2 className="text-3xl font-black">Create New Goal</h2>
              <p className="text-blue-100 dark:text-indigo-200 text-base font-bold mt-1">Define your objective and metrics.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 p-4 rounded-xl text-base font-bold border-2 border-red-300 dark:border-red-700 flex gap-2 items-start transition-colors">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Goal Title</label>
                <input required type="text" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 focus:border-blue-600 dark:focus:border-indigo-400 outline-none transition-all placeholder-slate-500 dark:placeholder-slate-400" placeholder="e.g. Increase Q3 Sales Revenue" />
              </div>

              <div>
                <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Description</label>
                <textarea rows="3" value={newGoal.description} onChange={e => setNewGoal({...newGoal, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 focus:border-blue-600 dark:focus:border-indigo-400 outline-none transition-all placeholder-slate-500 dark:placeholder-slate-400 resize-none" placeholder="Details about how this will be achieved..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Unit</label>
                  <select value={newGoal.uom} onChange={e => setNewGoal({...newGoal, uom: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 focus:border-blue-600 dark:focus:border-indigo-400 outline-none transition-colors">
                    <option value="Numeric">Numeric</option>
                    <option value="%">% Percentage</option>
                    <option value="Timeline">Timeline</option>
                    <option value="Zero-based">Zero-based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Target</label>
                  <input required type="number" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 focus:border-blue-600 dark:focus:border-indigo-400 outline-none placeholder-slate-500 dark:placeholder-slate-400 transition-colors" placeholder="e.g. 500" />
                </div>
                <div>
                  <label className="block text-base font-black text-slate-800 dark:text-slate-200 mb-2">Weightage (%)</label>
                  <input required type="number" min="10" max="100" value={newGoal.weightage} onChange={e => setNewGoal({...newGoal, weightage: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-indigo-500/50 focus:border-blue-600 dark:focus:border-indigo-400 outline-none placeholder-slate-500 dark:placeholder-slate-400 transition-colors" placeholder="Min 10" />
                </div>
              </div>

              <div className="pt-6 flex gap-4 justify-end">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-black text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 bg-blue-700 hover:bg-blue-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg dark:shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all hover-lift">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
