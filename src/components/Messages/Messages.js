import React, { Component } from 'react';
import { Segment , Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import firebase from '../../firebase';
import Typing from './Typing';

import { connect } from 'react-redux';
import { setUserPosts } from '../../actions/index';

class Messages extends Component {

    state = {
        privateChannel: this.props.isPrivateChannel,
        privateMessagesRef: firebase.database().ref('privateMessages'),
        messageRef: firebase.database().ref('messages'),
        messages: [],
        messagesLoading: true,
        usersRef: firebase.database().ref('users'),
        channel: this.props.currentChannel,
        isChannelStarred: false,
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
            this.addUserStarsListener(channel.id, user.uid)
            
        }
    }

    addUserStarsListener = (channelId, userId) => {
        this.state.usersRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if(data.val() !== null ) {
                    const channelIds = Object.keys(data.val());
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred });
                }
            });
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
            this.countUniqueUsers(loadedmessages);
            this.countUserPosts(loadedmessages);
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

    countUserPosts = messages => {
        let userPosts = messages.reduce(( acc, message ) => {
            if(message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    avatar: message.user.avatar,
                    count: 1
                }
            }
            return acc;
        }, {});
        this.props.setUserPosts(userPosts);
    };


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

    //STAREED OR NOT 
    handleStar = () => {
        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        if(this.state.isChannelStarred) {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [this.state.channel.id]: {
                        name:this.state.channel.name,
                        details: this.state.channel.details,
                        createdBy: {
                            name:this.state.channel.createdBy.name,
                            avatar: this.state.channel.createdBy.avatar
                        }
                    }
                });
        } else {
            this.state.usersRef
                .child(`${this.state.user.uid}/starred`)
                .child(this.state.channel.id)
                .remove(err => {
                    if(err !== null) {
                        console.error(err);
                    }
                });
        }
    }


    render() {
        const { messageRef, messages,channel, user, numUniqueUsers, 
            searchTerm, searchResults, searchLoading , privateChannel, isChannelStarred } = this.state;

        return (
            <React.Fragment>
                <MessagesHeader 
                    channelName={this.displayChannelName(channel)}
                    uniqueUsers={numUniqueUsers}
                    handleSearchChange={this.handleSearchChange}
                    searchLoading={searchLoading}
                    isPrivateChannel={privateChannel}
                    handleStar={this.handleStar}
                    isChannelStarred={isChannelStarred}
                />

                <Segment>
                    <Comment.Group className="messages">
                    {/* MESSAGES DISPLAYS HERE */}
                    {searchTerm ? 
                        this.displayMessage(searchResults) 
                        : this.displayMessage(messages)}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="user__typing">cryff is typing</span> <Typing/>
                        </div>
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

export default connect(null, { setUserPosts })(Messages);