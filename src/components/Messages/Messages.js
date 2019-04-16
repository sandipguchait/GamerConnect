import React, { Component } from 'react';
import { Segment , Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';

class Messages extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messageRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        numUniqueUsers: '',
        searchTerm:'',
        searchLoading: false,
        searchResults: []
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
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadedmessages.push(snap.val());
            this.setState({
                messages : loadedmessages,
                messagesLoading: false
            });
            this.countUniqueUsers(loadedmessages)
        });
    }
    // Counting the Number of Users in the Chat channel
    countUniqueUsers = (messages) => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if(!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${ plural ? 's' : ''}`;
        this.setState({ numUniqueUsers });
    }
    // SHOWING THE MESSAGE UI 
    displayMessage = messages => {
       return messages.length > 0 && messages.map( message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    }

    displayChannelName = (channel) => {
        return channel ? `${this.state.privateChannel ? '@' : '#'}${channel.name}` : '';
    }

    // SEARCH MESSGES FUNCTION
    handleSearchChange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true
        }, () => this.handleSearchMessage())
    }

    // SEARCH FUNCTIONALITY
    handleSearchMessage = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    }

    //STORING ALL PRIVATE MESSAGES 
    getMessagesRef = () => {
        const { messageRef, privateMessagesRef, privateChannel } = this.state;
        return privateChannel ? privateMessagesRef : messageRef ;
    }

    render() {
        const { messageRef, messages,channel, user, numUniqueUsers, 
            searchTerm, searchResults, searchLoading , privateChannel } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}
                    uniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                />

                <Segment>
                    <Comment.Group className="messages">
                    {/* MESSAGES DISPLAYS HERE */}
                    {searchTerm ? this.displayMessage(searchResults) : this.displayMessage(messages)}
                    </Comment.Group>
                </Segment>

                <MessageForm  
                    messageRef={messageRef} 
                    currentChannel={channel} 
                    currentUser={user}
                    isPrivateChannel={privateChannel}
                    getMessagesRef={this.getMessagesRef}
                />
            </React.Fragment>
        );
    }
}

export default Messages;