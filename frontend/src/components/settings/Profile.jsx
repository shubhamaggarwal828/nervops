import { User, ShieldCheck, Mail, Calendar, Clock } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = ({ name, email, joined, lastLogin }) => {
  return (
    <SettingSection icon={User} title="Security Operator Profile">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <User size={36} className="text-cyan-400" />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
          </span>
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-lg font-bold text-white font-heading">{name || "NervOps Operator"}</h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mx-auto sm:mx-0">
              <ShieldCheck size={12} />
              ADMINISTRATOR
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-slate-500" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-slate-500" />
              <span>Member since: {joined}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Clock size={14} className="text-slate-500" />
              <span>Last Session: {lastLogin}</span>
            </div>
          </div>
        </div>
      </div>
    </SettingSection>
  );
};

export default Profile;
