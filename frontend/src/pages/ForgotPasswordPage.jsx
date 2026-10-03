import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { Mail, Loader, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#090d16] relative overflow-hidden font-sans">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/15 via-emerald-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-xl shadow-cyan-500/20 mb-4">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
            Nerv<span className="text-cyan-400">Ops</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-mono">
            Recover Operator Access
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 shadow-2xl relative">
          <h3 className="text-xl font-bold text-white font-heading text-center mb-2">
            Forgot Password
          </h3>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-slate-400 text-xs text-center leading-relaxed mb-4">
                Enter your registered administrator email address and we will dispatch a secure password reset link.
              </p>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Operator Email
                </label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="size-4 animate-spin" />
                ) : (
                  "Send Password Reset Link"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Reset Link Dispatched</h4>
                <p className="text-slate-400 text-xs mt-1">
                  If an account exists for <span className="text-cyan-300 font-mono">{email}</span>, you will receive reset instructions shortly.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
