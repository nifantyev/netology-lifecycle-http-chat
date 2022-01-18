import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ myUserId, message }) => {
  const { userId, content } = message;
  return (
    <div
      className={`message ${
        myUserId === userId ? 'message-my' : 'message-other'
      }`}
    >
      {content}
    </div>
  );
};

Message.propTypes = {
  myUserId: PropTypes.string.isRequired,
  message: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
