import mongoose from 'mongoose';

import abstractEntityModel from './abstract-entity-schema.js';

const userPreferencesSchema = new mongoose.Schema({
	receiveGroupInvitationNotification: {
		type: Boolean,
		default: false,
	},
	receiveFriendRequestNotification: {
		type: Boolean,
		default: false,
	},
	receiveExpenseAddedNotification: {
		type: Boolean,
		default: false,
	},
	receiveExpenseEditedDeletedNotification: {
		type: Boolean,
		default: false,
	},
	receiveExpenseCommentNotification: {
		type: Boolean,
		default: false,
	},
	receiveExpenseDueNotification: {
		type: Boolean,
		default: false,
	},
	receivePaymentNotification: {
		type: Boolean,
		default: false,
	},
	receiveMonthlySummaryNotification: {
		type: Boolean,
		default: false,
	},
	receiveMajorUpdatesNotification: {
		type: Boolean,
		default: false,
	},
}, { _id: false });

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	nickname: {
		type: String,
		required: false,
	},
	preferences: {
		type: userPreferencesSchema,
		default: {},
	},
});

// Extend abstractEntitySchema
userSchema.add(abstractEntityModel);

const User = mongoose.model('User', userSchema);

export default User;
