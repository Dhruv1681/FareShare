import React from 'react';
import UserGetResponse from '../../service/api-service/schema/response/UserGetResponse';

interface UserChipProps {
    user: UserGetResponse;
    onRemove: (userId: string) => void;
  }

//The user and on onremove should be passed as props
const UserChip: React.FC<UserChipProps> = ({ user, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(user.id);
  };

  return (
    <div className="user-chip">
      {user.username}
      <span className="remove-icon" onClick={handleRemoveClick}>
        &#x2715;
      </span>
    </div>
  );
};

export default UserChip;
