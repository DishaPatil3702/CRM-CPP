//Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, BarChart3, ArrowLeft, Check, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import React from "react";
import CRMProLogo from "../components/CRMProLogo";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [forgotEmailFocused, setForgotEmailFocused] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  setSuccess("");

  try {
    const formData = new URLSearchParams();
    formData.append("email", email);    // ✅ matches backend
    formData.append("password", password);

    const res = await fetch(`${API_URL}/auth/login`,  {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Invalid credentials");
    }

    const data = await res.json();
   login(data.access_token);
    //localStorage.setItem("token", data.access_token);

    setSuccess("✅ Login successful! Redirecting...");
    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to send reset email");
      }

      setForgotSuccess("✅ Password reset link sent to your email!");
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotSuccess("");
      }, 3000);
    } catch (err) {
      setForgotError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security with multi-layer protection", color: "from-emerald-500 to-teal-500" },
    { icon: Zap, title: "Lightning Fast", desc: "Optimized performance with real-time updates", color: "from-amber-500 to-orange-500" },
    { icon: BarChart3, title: "Advanced Analytics", desc: "AI-powered insights and predictive analytics", color: "from-violet-500 to-purple-500" }
  ];

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10 w-full max-w-md">
          <div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-purple-500/10 hover:shadow-2xl"
            style={{ animation: 'modalSlideIn 0.6s ease-out' }}
          >
            <div className="text-center mb-8">
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotError("");
                  setForgotSuccess("");
                  setForgotEmail("");
                }}
                className="absolute top-6 left-6 p-2 text-gray-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex justify-center mb-6">
                  <CRMProLogo size={72} showText={false} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Reset Password</h2>
              <p className="text-gray-300 leading-relaxed">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-6">
              {forgotError && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm animate-slideDown">
                  <AlertCircle className="w-4 h-4" />
                  <span>{forgotError}</span>
                </div>
              )}
              {forgotSuccess && (
                <div className="flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm animate-slideDown">
                  <Check className="w-4 h-4" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${forgotEmailFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onFocus={() => setForgotEmailFocused(true)}
                    onBlur={() => setForgotEmailFocused(false)}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 pointer-events-none ${forgotEmailFocused ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={forgotLoading || !forgotEmail}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center">
                  {forgotLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Remember your password?{" "}
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-900 to-slate-900"></div>
      
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-slate-900/50"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 py-24">
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                CRMPro
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Advanced Customer Relationship Management platform designed for modern businesses and enterprises
            </p>
          </div>
          
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-6 group cursor-pointer"
                style={{ animation: `slideInLeft 0.8s ease-out ${index * 0.2}s both` }}
              >
                <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-purple-500/25`}>
                 
                  {React.createElement(feature.icon, { className: "w-7 h-7 text-white" })}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced animated background elements */}
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute bottom-32 right-40 w-28 h-28 bg-purple-500/10 rounded-full animate-bounce blur-lg" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-20 h-20 bg-pink-500/10 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
        <div className="w-full max-w-md">
          <div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 transform transition-all duration-500 hover:shadow-purple-500/10 hover:shadow-2xl"
            style={{ animation: 'slideInRight 0.8s ease-out' }}
          >
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <CRMProLogo size={80} showText={true} />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-gray-300 leading-relaxed">Sign in to access your CRM dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm animate-slideDown">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm animate-slideDown">
                  <Check className="w-4 h-4" />
                  <span>{success}</span>
                </div>
              )}

              {/* Enhanced Email Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${emailFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 pointer-events-none ${emailFocused ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              {/* Enhanced Password Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${passwordFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-14 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-all duration-300 p-1 hover:bg-white/10 rounded-full"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 pointer-events-none ${passwordFocused ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

              {/* Enhanced Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-300 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-600 rounded bg-transparent focus:ring-blue-500 focus:ring-2 transition-all duration-300" 
                  />
                  <span className="group-hover:text-white transition-colors duration-300">Remember me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Enhanced Footer */}
            <p className="mt-10 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <a 
                href="/signup" 
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
              >
                Create one now
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes animate-gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: animate-gradient 3s ease infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}