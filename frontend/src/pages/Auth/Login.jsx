import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-white">
      {/* Left side: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black">
        <img 
          src="/bg.png" 
          alt="PerformX Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Darkened overlay for crisp text */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-[#020617]"></div>
        <div className="absolute bottom-12 left-12 right-12 z-10 bg-black/60 backdrop-blur-md p-8 rounded-2xl border-l-4 border-indigo-500 shadow-2xl">
          <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-md">Elevate Your Performance</h2>
          <p className="text-slate-200 text-lg drop-shadow-md">Align your daily goals with the organization's vision using our state-of-the-art tracking portal.</p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-md w-full space-y-10 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                <Activity size={32} className="text-white" />
              </div>
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">
                PerformX
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400 text-sm">Please sign in to your account to continue.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/50 border border-red-500/50 p-4 rounded-xl backdrop-blur-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-500"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-medium shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign in to Dashboard
            </button>
          </form>
          
          <div className="pt-6 border-t border-slate-800 text-center">
             <p className="text-sm text-slate-500 mb-2">Demo Credentials (Password: demo123)</p>
             <div className="flex justify-center gap-4 text-xs text-slate-400 mb-6">
               <span>admin@performx.com</span>
               <span>manager1@...</span>
               <span>employee1@...</span>
             </div>
             <p className="text-sm text-slate-400">
               Don't have an account?{' '}
               <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                 Create one here
               </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
