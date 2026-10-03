import { User } from "lucide-react";
import SettingSection from "./SettingSection";

const Profile = ({ name, email, Joined, lastLogin }) => {
  return (
    <SettingSection icon={User} title="Profile">
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <img
          src="https://icons.iconarchive.com/icons/diversity-avatars/avatars/256/robot-01-icon.png"
          alt="Profile"
          className="rounded-full w-20 h-20 object-cover mr-4"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-100">Name : {name}</h3>
          <p className="text-gray-400">Email-Id : {email}</p>
		  <p className="text-gray-400"> Joined : {Joined}</p>
		  <p className="text-gray-400"> Last Login : {lastLogin}</p>
        </div>
      </div>
    </SettingSection>
  );
};

export default Profile;
