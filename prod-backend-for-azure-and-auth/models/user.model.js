import mongoose from "mongoose";

const azureAccountSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	azureEmail: {
		type: String,
		required: true,
	},
	clientId: {
		type: String,
		required: true,
	},
	clientSecret: {
		type: String,
		required: true,
	},
	tenantId: {
		type: String,
		required: true,
	},
	subscriptionId: {
		type: String,
		required: true,
	},
	lastUsed: {
		type: Date,
		default: Date.now,
	},
});

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const AzureAccount = mongoose.model("AzureAccount", azureAccountSchema);
