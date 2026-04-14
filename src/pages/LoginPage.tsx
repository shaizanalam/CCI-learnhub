import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, MailCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error, needsVerification } = await signUp(email, password, name);
        if (error) {
          toast.error(error);
        } else if (needsVerification) {
          setShowVerificationAlert(true);
          setIsSignUp(false);
          setName('');
          setPassword('');
        } else {
          toast.success('Account created! Please wait for admin approval before logging in.');
          setIsSignUp(false);
          setName('');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error, needsApproval, needsVerification } = await signIn(email, password);
        if (needsVerification) {
          setShowVerificationAlert(true);
        } else if (needsApproval) {
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-200/30 -top-[200px] -left-[200px] blur-[100px] animate-orb pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-200/30 -bottom-[150px] -right-[150px] blur-[100px] animate-orb-reverse pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full bg-blue-200/30 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 blur-[80px] animate-orb pointer-events-none" />

      <form onSubmit={handleSubmit} className="animate-slide-up relative z-10 bg-white/80 backdrop-blur-lg border border-white/20 rounded-3xl p-10 w-[min(480px,92vw)] shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-gray-200">
            <Logo size="lg" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Join CCI Learning Platform' : 'Sign in to continue learning'}
          </p>
        </div>

        {/* Restriction Notice */}
        <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
          <Lock className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <p className="text-sm text-purple-700">Access restricted to registered students only</p>
        </div>

        {isSignUp && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Your full name"
              />
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="student@cci.edu.in"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:transform-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Please wait...
            </div>
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </button>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            <span className="font-semibold">CCI</span> - Chhattisgarh Coaching Institute
          </p>
          <p className="text-xs text-gray-400 mt-1">Empowering students for Class 10 success</p>
        </div>
      </form>

      {/* Email Verification Alert */}
      {showVerificationAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slide-up">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6 mx-auto">
              <MailCheck className="w-8 h-8 text-blue-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Check Your Email! 
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  We've sent a verification email to <span className="font-semibold text-gray-900">{email}</span>
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs">1</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Open your email inbox and find the verification email from CCI
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs">2</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Click the verification link in the email to activate your account
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-xs">3</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Come back here and sign in with your verified account
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-blue-700 text-center">
                <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes.
              </p>
            </div>
            
            <button
              onClick={() => setShowVerificationAlert(false)}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Got it, I'll check my email
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
