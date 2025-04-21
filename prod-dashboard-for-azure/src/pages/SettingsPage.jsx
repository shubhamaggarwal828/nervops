import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
const SettingsPage = () => {
	const { user } = useAuthStore();

	if (!user) {
		// Render a loading spinner, a placeholder, or redirect if user is not available
		return <p>Loading user data...</p>;
	}

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile
					name={user.name}
					email={user.email}
					joined={new Date(user.createdAt).toLocaleDateString("en-IN", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
					lastLogin={user.lastLogin ? formatDate(user.lastLogin) : "You just signed up"}
				/>
				<Notifications />
				{/* <Security /> */}
				{/* <ConnectedAccounts /> */}
				{/* <DangerZone /> */}
			</main>
		</div>
	);
};

export default SettingsPage;
