import { nanoid } from 'nanoid';
import React from 'react';
import Message from './Message';
import MessageForm from './MessageForm';

const API_URL = 'http://localhost:7777';

class Chat extends React.Component {
  state = {
    messages: [],
    lastLoadedMessageId: 0,
    loading: true,
    firstLoading: true,
    error: null,
    userId: '',
    sending: false,
    updated: null,
  };

  timeout = null;

  messageListRef = React.createRef();

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
          firstLoading: false,
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

  handleNewMessage = (messageText) => {
    fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 0,
        userId: this.state.userId,
        content: messageText,
      }),
    })
      .then((response) => this.setState({ sending: true, error: null }))
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
    if (
      (oldState.firstLoading && !this.state.firstLoading) ||
      (oldState.sending && !this.state.sending)
    ) {
      this.messageListRef.current.scrollTop =
        this.messageListRef.current.scrollHeight;
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.timeout);
  }

  render() {
    return (
      <div className="container">
        <div className="message-list" ref={this.messageListRef}>
          {this.state.messages.map((message) => (
            <Message
              key={message.id}
              myUserId={this.state.userId}
              message={message}
            />
          ))}
        </div>
        <p>Hi</p>
        <MessageForm onSubmit={this.handleNewMessage} />
        {this.state.sending && <span>...</span>}
        <div className="error">{this.state.error}</div>
      </div>
    );
  }
}

export default Chat;
