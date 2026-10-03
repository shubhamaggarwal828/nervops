import { Shield, Sparkles, Activity } from "lucide-react";

const Header = ({ title, subtitle }) => {
  return (
    <header className="sticky top-0 z-10 bg-[#090d16]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight flex items-center gap-2.5">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* System Health / Azure Connection status pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Azure Cloud Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
