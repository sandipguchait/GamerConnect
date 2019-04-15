import React, { Component } from 'react';
import { Segment , Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';

class Messages extends Component {

    state = {
        messageRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser
    }
    
    componentDidMount(){
        const { channel,user } = this.state;

        if( channel && user ) {
            this.addListeners(channel.id)
        }
    }

    addListeners = (channelId) => {
        this.addMessageListener(channelId);
    }
    // Listening and fetching all Messages 
    addMessageListener = (channelId) => {
        let loadedmessages = [];
        this.state.messageRef.child(channelId).on('child_added', snap => {
            loadedmessages.push(snap.val());
            this.setState({
                messages : loadedmessages,
                messagesLoading: false
            })
        });
    }

    displayMessage = messages => {
       return messages.length > 0 && messages.map( message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    }

    render() {
        const { messageRef, messages,channel, user } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader />

                <Segment>
                    <Comment.Group className="messages">
                    {/* MESSAGES HERE */}
                    {this.displayMessage(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm  messageRef={messageRef} currentChannel={channel} currentUser={user}/>
            </React.Fragment>
        );
    }
}

export default Messages;