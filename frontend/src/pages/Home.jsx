import { Link } from 'react-router-dom';
import { Activity, Target, Users, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/30">
              <Activity size={24} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
              PerformX
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors">Sign In</Link>
            <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-slate-200 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Zap size={16} className="text-indigo-400" />
            <span>AtomQuest Hackathon 2026 Submission</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] animate-in slide-in-from-bottom-8 duration-700 delay-100">
            Align Your Team.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Accelerate Growth.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed animate-in slide-in-from-bottom-10 duration-700 delay-200">
            The enterprise-grade goal tracking portal designed to seamlessly connect employee objectives with organizational strategy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-12 duration-700 delay-300">
            <Link to="/register" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1">
              Start Free Trial
              <Activity size={20} className="group-hover:rotate-12 transition-transform" />
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-full font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 transition-colors">
              View Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need to scale</h2>
            <p className="text-xl text-slate-400">Powerful tools for employees, managers, and executives.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20 transition-colors"></div>
              <Target size={40} className="text-indigo-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Precision Goal Tracking</h3>
              <p className="text-slate-400 text-lg">Define clear objectives with customizable metrics, percentage targets, and precise weightage allocations.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-colors"></div>
              <Users size={40} className="text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Manager Check-ins</h3>
              <p className="text-slate-400 text-lg">Quarterly feedback loops and one-click goal approvals.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 rounded-3xl hover:border-pink-500/50 transition-colors group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[60px] group-hover:bg-pink-500/20 transition-colors"></div>
              <TrendingUp size={40} className="text-pink-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Gamified Performance</h3>
              <p className="text-slate-400 text-lg">Unlock "Top Performer" badges and climb the company leaderboard.</p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-colors"></div>
              <ShieldCheck size={40} className="text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold mb-3">Enterprise Admin Dashboard</h3>
              <p className="text-slate-400 text-lg">Export CSV reports, monitor global completion rates, and manage platform access securely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900/20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[100px] opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl font-black mb-8">Ready to transform your workforce?</h2>
          <Link to="/register" className="inline-block bg-white text-black px-10 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.4)]">
            Create Your Workspace
          </Link>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
