import React, { Component } from 'react';
import firebase from '../../firebase';
import { Menu, Icon } from 'semantic-ui-react';
import {connect} from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/index';

class Starred extends Component {

    state = {
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        activeChannel: '',
        starredChannels: []
    };

    componentDidMount () {
        if(this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    };

    addListeners = (userId) => {
        // Update when channel is starred
        this.state.usersRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };
                this.setState({
                    starredChannels: [...this.state.starredChannels, starredChannel]
                });
            });
            // update when channel is unStarred
            this.state.usersRef
                .child(userId)
                .child('starred')
                .on('child_removed', snap => {
                    const channelToRemove = { id: snap.key, ...snap.val()};
                    const filteredChannels = this.state.starredChannels.filter(channel => {
                        return channel.id !== channelToRemove.id;
                    });
                    this.setState({ starredChannels: filteredChannels });
                })
    }


    changeChannel = channel => {
        this.setActivechannel(channel);
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
   };

    setActivechannel = (channel) => {
        this.setState({ activeChannel: channel.id });
    };


    displayChannels = (starredChannels) => {
        return starredChannels.length > 0 && starredChannels.map( channel => (
             <Menu.Item
                key={channel.id}
                onClick={()=>this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: 2}}
                active={channel.id === this.state.activeChannel}
             >
                 # {channel.name}
             </Menu.Item>
         ))
     } 

    render() {
        const { starredChannels } = this.state; 

        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                    </span>{" "}
                    ({ starredChannels.length})
                </Menu.Item>
                {/* SHOW Starred Channels */}
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

export default connect(null,{ setCurrentChannel, setPrivateChannel })(Starred);