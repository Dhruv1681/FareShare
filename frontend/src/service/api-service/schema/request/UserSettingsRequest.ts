export default interface UserSettingsRequest {
    firstname: string;
    lastname: string;
    email: string;
    nickname: string;
    preferences: Preferences;
}

export interface Preferences {
    receiveExpenseAddedNotification?: boolean;
    receiveExpenseEditedDeletedNotification?: boolean;
    receiveGroupInvitationNotification?: boolean;
    receiveFriendRequestNotification?: boolean;
    receiveExpenseCommentNotification?: boolean;
}

