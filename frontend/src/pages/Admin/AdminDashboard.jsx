import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Download, Users, Target, CheckCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API}/api/admin/stats`, config);
      setStats(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load system statistics. (Did you restart the backend server?)');
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const config = { 
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob' 
      };
      const res = await axios.get(`${API}/api/admin/export`, config);
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PerformX_System_Report.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to export data');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  }

  const chartData = [
    { name: 'Completed', value: stats?.completedGoals || 0 },
    { name: 'In Progress', value: (stats?.totalGoals || 0) - (stats?.completedGoals || 0) }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Header */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-white dark:bg-[#0f172a] p-8 rounded-3xl relative overflow-hidden border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 dark:bg-purple-600/20 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>
          
          <div className="relative z-10 mb-8">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
              Platform Administration
            </h1>
            <p className="text-slate-800 dark:text-slate-200 mt-2 text-lg font-bold transition-colors">Global system overview and performance reporting.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
             <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black shadow-lg transition-all hover:-translate-y-1"
              >
                <Download size={24} />
                Export CSV Report
             </button>
             <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-300 dark:border-slate-600 shadow-inner transition-colors">
                <Users className="text-purple-600 dark:text-purple-400" size={28} />
                <div>
                  <p className="text-sm text-slate-800 dark:text-slate-300 font-black uppercase tracking-wider mb-0.5">Total Users</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{stats?.totalUsers}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Global Chart */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl dark:shadow-2xl flex flex-col items-center justify-center transition-colors duration-300">
           <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Global Goal Completion</h3>
           <div className="h-40 w-full relative">
             {(stats?.totalGoals > 0) ? (
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
                     <Cell fill="#10b981" />
                     <Cell fill="var(--tw-colors-slate-300)" className="dark:fill-slate-700" />
                   </Pie>
                   <RechartsTooltip formatter={(value) => value} contentStyle={{fontWeight: 'bold', color: 'black'}} />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center rounded-full border-4 border-dashed border-slate-200 dark:border-slate-700 mx-auto" style={{width: '130px', height: '130px'}}>
                 <span className="text-slate-400 font-bold text-sm">No Data</span>
               </div>
             )}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900 dark:text-white">{stats?.totalGoals > 0 ? Math.round((stats.completedGoals / stats.totalGoals) * 100) : 0}%</span>
             </div>
           </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/80 text-red-900 dark:text-red-100 p-4 rounded-xl text-base font-bold border-2 border-red-300 dark:border-red-700 flex gap-2 items-start transition-colors">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0B1121]/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md transition-colors">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-slate-800 dark:text-slate-300">Total Goals</h3>
             <Target className="text-blue-500" size={24} />
          </div>
          <p className="text-4xl font-black">{stats?.totalGoals}</p>
        </div>
        <div className="bg-white dark:bg-[#0B1121]/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md transition-colors">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-slate-800 dark:text-slate-300">Approved Goals</h3>
             <CheckCircle className="text-green-500" size={24} />
          </div>
          <p className="text-4xl font-black">{stats?.approvedGoals}</p>
        </div>
        <div className="bg-white dark:bg-[#0B1121]/60 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md transition-colors">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-black text-slate-800 dark:text-slate-300">Active Engagement</h3>
             <Activity className="text-purple-500" size={24} />
          </div>
          <p className="text-4xl font-black">{stats?.totalGoals > 0 ? 'High' : 'Low'}</p>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-300 dark:border-slate-700 shadow-xl overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recently Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-sm font-black text-slate-600 dark:text-slate-400 uppercase">Name</th>
                <th className="px-6 py-4 text-sm font-black text-slate-600 dark:text-slate-400 uppercase">Email</th>
                <th className="px-6 py-4 text-sm font-black text-slate-600 dark:text-slate-400 uppercase">Role</th>
                <th className="px-6 py-4 text-sm font-black text-slate-600 dark:text-slate-400 uppercase">Department</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers?.map((u, i) => (
                <tr key={u._id} className={i % 2 === 0 ? 'bg-white dark:bg-slate-900/20' : 'bg-slate-50 dark:bg-slate-800/30'}>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-black rounded-full">{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-bold">{u.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
