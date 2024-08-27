export default interface UserGetResponse {
    id: string;
    firstname: string;
    lastname: string;
    fullname: string;
    username: string;
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

