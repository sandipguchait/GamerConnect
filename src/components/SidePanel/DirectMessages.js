import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel , setPrivateChannel } from '../../actions/index';
import firebase from '../../firebase';


class DirectMessages extends Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        users: [],
        usersRef: firebase.database().ref('users'),
        connectedRef: firebase.database().ref('.info/connected'),
        presenceRef: firebase.database().ref('presence')
    }

    componentDidMount(){
        if(this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    };

    componentWillUnmount(){
        this.state.usersRef.off();
        this.state.presenceRef.off();
        this.state.connectedRef.off();
    }

    addListeners = ( currentUserUID ) => {
        let loadedUsers = [];
        this.state.usersRef.on('child_added', snap => {
            if( currentUserUID !== snap.key ){
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = "Offline"
                loadedUsers.push(user);
                this.setState({ users: loadedUsers });
            }
        });
        // checking users online/offline status
        this.state.connectedRef.on('value', snap => {
            if(snap.val() === true ){
                const ref = this.state.presenceRef.child(currentUserUID);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    if(err !== null ){
                        console.error(err);
                    }
                })
            }
        });
        //showing Online feature
        this.state.presenceRef.on('child_added', snap => {
            if(currentUserUID !== snap.key) {
                //add status to user
                this.addStatusToUser(snap.key);
            }
        });
        // Showing off feature
        this.state.presenceRef.on('child_removed', snap => {
            if(currentUserUID !== snap.key) {
                //add status to user
                this.addStatusToUser(snap.key, false);
            }
        });
    }

    // ADDING ONLINE/OFFLINE MAIN Function
    addStatusToUser = (userId, connected = true ) => {
        const updatedUsers = this.state.users.reduce((acc, user) => {
            if(user.uid === userId) {
                user['status'] = `${connected ? 'Online' : 'Offline'}`
            }
            return acc.concat(user);
        }, []);
        this.setState({ users: updatedUsers });
    }

    //SHOWING ONLINE / OFFLINE CHAT COLOURS 
    isUserOnline = ( user ) => {
        return user.status === 'Online'
    }

    changeChannel = user => {
        const channelId = this.getChannelId(user.uid);
        const channelData = {
            id: channelId,
            name: user.name
        };
        this.props.setCurrentChannel(channelData);
        this.props.setPrivateChannel(true);
        this.setActiveChannel(user.uid);
    }

    setActiveChannel = userId => {
        this.setState({ activeChannel: userId });
    }

    getChannelId = userId  => {
        const currentUserId = this.state.user.uid;
        return userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }

    render() {
        const { users , activeChannel } = this.state;
        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="mail"/> MESSAGES
                    </span>{' '}
                    ({users.length})
                </Menu.Item>
                {/* Users to Send Direct Messages */}
                {users.map(user => (
                    <Menu.Item 
                        key={user.uid}
                        active={user.uid === activeChannel}
                        onClick={() => this.changeChannel(user)}
                        style={{ opacity: 10, fontStyle: 'italic'}}
                    >
                        <Icon
                            name="circle"
                            style={{ opacity: 0.7 }}
                            color={this.isUserOnline(user) ? 'yellow' : null }
                        />
                        @{user.name}
                    </Menu.Item>
                ))}
            </Menu.Menu>
        );
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);