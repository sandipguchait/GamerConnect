import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button, Modal , Icon , Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import {setColors} from '../../actions/index';

class ColorPanel extends Component {
    state = {
        modal: false,
        user: this.props.currentUser,
        usersRef: firebase.database().ref('users'),
        primary: '',
        secondary: '',
        userColors: []
    };

    componentDidMount(){
        if(this.state.user) {
            this.addListener(this.state.user.uid);
        }
    };

    componentWillUnmount() {
        this.state.usersRef.child(`${this.state.user.uid}/colors`).off();
    }

    addListener = userId => {
        let userColors = [];
        this.state.usersRef
            .child(`${userId}/colors`)
            .on('child_added', snap => {
                userColors.unshift(snap.val());
                this.setState({ userColors });
            })
    }

    onChangePrimary = color => this.setState({ primary: color.hex });
    onChangeSecondary = color => this.setState({ secondary: color.hex });

    openModal = () =>  this.setState({ modal: true });
    closeModal = () => this.setState({ modal: false });

    handleSaveColors = () => {
        if(this.state.primary && this.state.secondary){
            this.saveColors(this.state.primary, this.state.secondary);
        }
    };

    saveColors = (primary, secondary) => {
        this.state.usersRef
            .child(`${this.state.user.uid}/colors`)
            .push()
            .update({
                primary,
                secondary
            })
            .then(() => {
                console.log("Colors added");
                this.closeModal();
            })
            .catch(err => console.log(err));
    };

    displayUserColors = (colors) => (
        colors.length > 0 && colors.map((color, i) => (
            <React.Fragment key={i}>
               <Divider/>
               <div className="color__container" onClick={() => this.props.setColors(color.primary, color.secondary)}>
                <div className="color__square" style={{ background: color.primary }}>
                  <div className="color__overlay" style={{ background: color.secondary }}>
                  </div>
                </div>
               </div> 
            </React.Fragment>
        ))
    )

    render() {
        const { modal, primary, secondary, userColors } = this.state;
        
        return (
            <Sidebar
                as={Menu}
                color="violet"
                icon="labeled"
                inverted
                vertical
                visible
                width="very thin"
            >
            <Divider/>
            <Button icon="add" size="small" color="black" onClick={this.openModal}/>
            {this.displayUserColors(userColors)}

            {/* COLOR PICKER MODAL */}
                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Choose App Color</Modal.Header>
                    <Modal.Content>
                        <Segment inverted>
                            <Label content="Primary Color" />
                            <SliderPicker color={primary} onChange={this.onChangePrimary}/>
                        </Segment>

                        <Segment inverted>
                            <Label content="Secondary Color" />
                            <SliderPicker color={secondary} onChange={this.onChangeSecondary}/>
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSaveColors}>
                            <Icon name="checkmark" /> Save Color
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal}>
                            <Icon name="remove" /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Sidebar>
        );
    }
}

export default connect(null,{ setColors })(ColorPanel);