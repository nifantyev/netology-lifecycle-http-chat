import React from 'react';
import PropTypes from 'prop-types';

class MessageForm extends React.Component {
  state = {
    messageText: '',
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    const { onSubmit } = this.props;
    event.preventDefault();
    onSubmit(this.state.messageText);
    this.setState({ messageText: '' });
  };

  render() {
    return (
      <form className="message-form" onSubmit={this.handleSubmit}>
        <div className="message-input-wrapper">
          <input
            className="message-input"
            name="messageText"
            value={this.state.messageText}
            onChange={this.handleChange}
          />
          <button className="message-submit" type="submit">
            <span className="material-icons">send</span>
          </button>
        </div>
      </form>
    );
  }
}

MessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default MessageForm;
