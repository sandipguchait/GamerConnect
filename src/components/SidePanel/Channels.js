import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions/index';

class Channels extends Component {

    state = {
        user: this.props.currentUser,
        channel: null,
        activeChannel: '',
        channels: [],
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        typingRef: firebase.database().ref('typing'),
        notifications: [],
        modal: false,
    }

    componentDidMount() {
        this.addChannelListeners();
    }

    componentWillUnmount(){
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelsRef.off();
        
    }

    // GEtting list of channels added by the particular User
    addChannelListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, ()=> this.defaultChannel());
            this.addNotificationListener(snap.key);
        })
    }

    addNotificationListener = (channelId) => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if(this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap ) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId);

        if(index !== -1) {
            if( channelId !== currentChannelId ) {
                lastTotal = notifications[index].total;

                if(snap.numChildren() - lastTotal > 0){
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }

        this.setState({ notifications })
    }

    clearNotification = () => {
        let index = this.state.notifications.findIndex(notification => notification.id === this.state.channel.id);

        if(index !== -1 ){
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;
            this.setState({ notifications: updatedNotifications });
        }
    }

    // The channel that shows up when component mounts
    defaultChannel = () => {
        const firstChannel = this.state.channels[0];
        if(this.state.channels && this.state.channels.length > 0 ) {
             this.props.setCurrentChannel(firstChannel);
             this.setActivechannel(firstChannel);
             this.setState({ channel: firstChannel });
        }
    }

    closeModal = () => this.setState({ modal: false });

    openModal = () => this.setState({ modal: true });

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }    

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
        }
    }

    isFormValid = ({ channelDetails,  channelName }) => {
        if( channelDetails && channelName ) {
            return true;
        } else return false;
    }

    // ADDING CHANNELS TO THE FIREBASE DB 
    addChannel = () => {
        const { channelsRef, channelDetails, channelName , user } = this.state;
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };
        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelDetails: '', channelName: ''});
                this.closeModal();
                console.log('channnel Added')
            })
            .catch(err => {
                console.error(err);
            })
    }

    // DISPLAYING CHANNELS
    displayChannels = (channels) => {
       return channels.length > 0 && channels.map( channel => (
            <Menu.Item
               key={channel.id}
               onClick={()=>this.changeChannel(channel)}
               name={channel.name}
               style={{ opacity: 2}}
               active={channel.id === this.state.activeChannel}
            >
                {this.getNotificationCount(channel) && (
                    <Label color="red">{this.getNotificationCount(channel)}</Label>
                )}
                # {channel.name}
            </Menu.Item>
        ))
    } 

    //SET CHANNEL TO GLOBAL STATE
    changeChannel = channel => {
         this.setActivechannel(channel);
         this.state.typingRef
            .child(this.state.channel.id)
            .child(this.state.user.uid)
            .remove();
         this.props.setCurrentChannel(channel);
         this.clearNotification();
         this.props.setPrivateChannel(false);
         this.setState({ channel });
    }

    setActivechannel = (channel) => {
        this.setState({ activeChannel: channel.id });
    }

    getNotificationCount = (channel) => {
        let count = 0;

        this.state.notifications.forEach(notification => {
            if( notification.id === channel.id ) {
                count = notification.count;
            }
        });
        if(count > 0) return count;
    }


    render() {
        const { channels, modal } = this.state;

        return (
            <React.Fragment>
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="exchange" /> CHANNELS
                    </span>{" "}
                    ({ channels.length})<Icon name="add" onClick={this.openModal}/> 
                </Menu.Item>
                {/* SHOW CHANNELS */}
                {this.displayChannels(channels)}
            </Menu.Menu>

            {/* // ADD CHANNEL MODAL */}
            <Modal basic open={modal} onClose={this.closeModal}>
                <Modal.Header>Add a Channel</Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Input
                                fluid
                                label="Name of Channel"
                                name="channelName"
                                onChange={this.handleChange}
                            />
                        </Form.Field>

                        <Form.Field>
                            <Input
                                fluid
                                label="About the Channel"
                                name="channelDetails"
                                onChange={this.handleChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <Button color="green" inverted  onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> Add
                    </Button>
                    <Button color="red" inverted onClick={this.closeModal}>
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
         </React.Fragment>
        );
    }
};


export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);