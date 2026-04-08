import { useState } from 'react';
import { Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Account created! Please wait for admin approval before logging in.');
          setIsSignUp(false);
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error, needsApproval } = await signIn(email, password);
        if (needsApproval) {
          toast.error('Your account is pending admin approval. Please wait.');
        } else if (error) {
          toast.error(error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cci-accent/15 -top-[100px] -left-[150px] blur-[80px] animate-orb pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-cci-green/8 -bottom-[80px] -right-[100px] blur-[80px] animate-orb-reverse pointer-events-none" />

      <form onSubmit={handleSubmit} className="animate-slide-up relative z-10 bg-card border border-input rounded-3xl p-12 w-[min(440px,92vw)] shadow-[0_32px_80px_rgba(0,0,0,.6)]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-9">
          <div className="w-[46px] h-[46px] bg-gradient-to-br from-cci-accent to-cci-accent3 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_24px_hsl(var(--cci-glow))]">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="font-syne font-extrabold text-xl tracking-tight">
            CCI
            <span className="block text-[11px] font-semibold tracking-[2px] uppercase -mt-0.5 text-cci-accent">
              Chhattisgarh Coaching Institute
            </span>
          </div>
        </div>

        {/* Restriction */}
        <div className="flex items-center gap-2 bg-cci-rose/[.07] border border-cci-rose/[.15] rounded-lg p-2.5 px-3.5 mb-6 text-[13px] text-cci-rose">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
          Access restricted to registered students only
        </div>

        <h1 className="font-syne text-[28px] font-extrabold tracking-tight mb-1.5">
          {isSignUp ? 'Create Account 📝' : 'Welcome back 👋'}
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          {isSignUp ? 'Sign up to request access to the learning platform.' : 'Sign in to access your learning dashboard and study materials.'}
        </p>

        {isSignUp && (
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">Full Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-cci-bg3 border border-input rounded-lg py-3 px-4 text-foreground text-[15px] outline-none transition-all focus:border-cci-accent focus:shadow-[0_0_0_3px_hsl(var(--cci-accent)/0.15)] placeholder:text-cci-text3"
              placeholder="Your full name"
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">Email Address</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-cci-bg3 border border-input rounded-lg py-3 px-4 text-foreground text-[15px] outline-none transition-all focus:border-cci-accent focus:shadow-[0_0_0_3px_hsl(var(--cci-accent)/0.15)] placeholder:text-cci-text3"
            placeholder="student@cci.edu.in"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">Password</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-cci-bg3 border border-input rounded-lg py-3 px-4 text-foreground text-[15px] outline-none transition-all focus:border-cci-accent focus:shadow-[0_0_0_3px_hsl(var(--cci-accent)/0.15)] placeholder:text-cci-text3"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-3.5 bg-gradient-to-br from-cci-accent to-cci-accent3 rounded-lg text-primary-foreground font-syne font-bold text-[15px] tracking-wide mt-2 shadow-[0_8px_24px_hsl(var(--cci-accent)/0.35)] hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account →' : 'Sign In to CCI →'}
        </button>

        <p className="text-center mt-6 text-cci-text3 text-[13px]">
          {isSignUp ? 'Already have an account?' : 'Not registered?'}{' '}
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-cci-accent font-medium hover:underline">
            {isSignUp ? 'Sign In' : 'Create Account'}
          </button>
        </p>
      </form>
    </div>
  );
}
