import { nanoid } from 'nanoid';
import React from 'react';
import Message from './Message';

const API_URL = 'http://localhost:7777';

class Chat extends React.Component {
  state = {
    messages: [],
    lastLoadedMessageId: 0,
    loading: true,
    error: null,
    userId: '',
    messageText: '',
    sending: false,
    updated: null,
  };

  timeout = null;

  loadMessages = () => {
    this.setState({
      loading: true,
    });
    fetch(`${API_URL}/messages?from=${this.state.lastLoadedMessageId}`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          messages: [...this.state.messages, ...data],
          lastLoadedMessageId:
            data.length > 0
              ? Math.max.apply(
                  null,
                  data.map((item) => item.id)
                )
              : this.state.lastLoadedMessageId,
          loading: false,
          sending: false,
          error: null,
          updated: new Date(),
        })
      )
      .catch((error) => {
        this.setState({
          error: error.message,
          updated: new Date(),
        });
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 0,
        userId: this.state.userId,
        content: this.state.messageText,
      }),
    })
      .then((response) =>
        this.setState({ messageText: '', sending: true, error: null })
      )
      .catch((error) => this.setState({ error: error.message }));
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    let userId = window.localStorage.getItem('chatUserId');
    if (!userId) {
      userId = nanoid();
      window.localStorage.setItem('chatUserId', userId);
    }
    this.setState({
      userId: userId,
    });
    this.timeout = window.setTimeout(() => this.loadMessages(), 0);
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldState.updated !== this.state.updated) {
      this.timeout = window.setTimeout(() => this.loadMessages(), 3 * 1000);
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    return (
      <div className="container">
        <div className="message-list">
          {this.state.messages.map((message) => (
            <Message
              key={message.id}
              myUserId={this.state.userId}
              message={message}
            />
          ))}
        </div>
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
        {this.state.sending && <span>...</span>}
        <div className="error">{this.state.error}</div>
      </div>
    );
  }
}

export default Chat;
