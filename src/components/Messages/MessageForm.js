import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Input, Button } from 'semantic-ui-react';

class Messageform extends Component {

    state = {
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        loading: false,
        errors: []
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message,
        };
        return message;
    }

    sendMessage = () => {
        const { messageRef } = this.props;
        const { message, channel } = this.state;

        if(message) {
            this.setState({ loading: true })
            //send message to database
            messageRef
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: []})
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(err)
                    });
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message'})
            })
        }
    }

    render() {
        const { errors, message, loading } = this.state;

        return (
            <Segment className="message__form">
                <Input 
                   fluid
                   onChange={this.handleChange}
                   name="message"
                   value={message}
                   disabled={loading}
                   style={{ marginBottom: '0.7em'}}
                   label={<Button icon={'add'} />}
                   labelPosition="left"
                   className={errors.some( error => error.message.includes('message')) ? 'error' : ''}
                   placeholder="Write your message"
                />
                <Button.Group icon widths="2">
                    <Button 
                       onClick={this.sendMessage}
                       color="orange"
                       content="Send Message"
                       labelPosition="left"
                       icon="edit"
                    />
                    <Button.Or text='OR' />
                    <Button 
                        color="teal"
                        content="Upload Media"
                        labelPosition="right"
                        icon="upload"
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default Messageform;