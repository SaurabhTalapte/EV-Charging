import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

export default function SignupPage() {
  const { signup, loginWithGoogle } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirmPw) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    signup(name, email, password);
    navigate('/');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] relative overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-cyan-500 mb-4 animate-pulse-glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Join ChargeHub
          </h1>
          <p className="text-[var(--color-text-dim)] mt-2">Create your account and start charging smarter</p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-6">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="signup-name" type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="signup-password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-dim)] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-dim)]" />
                <input id="signup-confirm" type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all" />
              </div>
            </div>

            <button id="signup-submit" type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[var(--color-text-dim)]">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button id="signup-google" onClick={handleGoogle} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-[var(--color-text-dim)]">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
