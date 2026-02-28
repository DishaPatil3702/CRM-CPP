import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import React from "react";
export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password, name }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Signup failed");
      }

      setSuccess("✅ Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(typeof err.message === "string" ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: "Enterprise Security", desc: "Bank-level encryption and multi-factor authentication", color: "from-emerald-500 to-teal-500" },
    { icon: Zap, title: "Instant Setup", desc: "Get your CRM configured and running in under 60 seconds", color: "from-amber-500 to-orange-500" },
    { icon: BarChart3, title: "AI-Powered Insights", desc: "Machine learning analytics for predictive customer behavior", color: "from-violet-500 to-purple-500" }
  ];

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
              Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                CRMPro
              </span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Start your journey with the most advanced Customer Relationship Management platform trusted by thousands of businesses worldwide
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

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24 relative">
        <div className="w-full max-w-md">
          <div 
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 transform transition-all duration-500 hover:shadow-purple-500/10 hover:shadow-2xl"
            style={{ animation: 'slideInRight 0.8s ease-out' }}
          >
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center transform transition-transform duration-300 hover:scale-110 shadow-lg shadow-purple-500/25">
                <User className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
              <p className="text-gray-300 leading-relaxed">Join thousands of businesses growing with CRMPro</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm animate-slideDown">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm animate-slideDown">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>{success}</span>
                </div>
              )}

              {/* Enhanced Name Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${nameFocused ? 'text-blue-400' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setNameFocused(true)}
                    onBlur={() => setNameFocused(false)}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-400 focus:bg-white/10 focus:ring-2 focus:ring-blue-400/20 focus:outline-none"
                  />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 pointer-events-none ${nameFocused ? 'opacity-100' : ''}`}></div>
                </div>
              </div>

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
                    placeholder="Enter your email address"
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
                    placeholder="Create a secure password"
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
                {/* Password Strength Indicator */}
                <div className="mt-2 space-y-1">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          password.length >= i * 2
                            ? password.length >= 8
                              ? 'bg-green-500'
                              : password.length >= 6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                            : 'bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {password.length === 0
                      ? 'Password strength will appear here'
                      : password.length < 6
                      ? 'Weak - Add more characters'
                      : password.length < 8
                      ? 'Fair - Almost there'
                      : 'Strong - Great password!'}
                  </p>
                </div>
              </div>

              {/* Enhanced Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                    className="w-5 h-5 text-blue-600 border-2 border-gray-600 rounded bg-transparent focus:ring-blue-500 focus:ring-2 transition-all duration-300 cursor-pointer"
                  />
                  <div className={`absolute inset-0 rounded bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 pointer-events-none ${acceptTerms ? 'opacity-100' : ''}`}></div>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed cursor-pointer group">
                  I agree to the{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline font-medium">
                    Terms of Service
                  </a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 hover:underline font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Enhanced Footer */}
            <div className="mt-10">
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                <span className="px-4 text-sm text-gray-400">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>
              
              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 hover:underline"
                >
                  Sign in instead
                </a>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs">GDPR Compliant</span>
                </div>
              </div>
            </div>
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