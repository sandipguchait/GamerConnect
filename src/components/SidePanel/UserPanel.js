import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown, Image, Modal, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';

class UserPanel extends Component {

    state = {
        user: this.props.currentUser,
        modal: false,
        previewImage: '',
        croppedImage: '',
        blob: '',
        storageRef: firebase.storage().ref(),
        userRef: firebase.auth().currentUser,
        usersRef: firebase.database().ref('users'),
        metadata: {
            contentType: 'image/jpeg'
        },
        uploadCroppedImage: ''
    }

    openModal = () => {
        this.setState({ modal: true })
    }

    closeModal = () => {
        this.setState({ modal: false })
    }
    // FOR CHANGING AVATAR
    handleChange = (event) => {
        // Using FileReader API to read the File
        const file = event.target.files[0];
        const reader = new FileReader();

        if(file) {
            reader.readAsDataURL(file);
            reader.addEventListener('load', () => {
                this.setState({ previewImage: reader.result });
            })

        }
    }

    dropdownOptions = () => [
        {
            key: 'user',
            text:<span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
            disabled: true
        },
        {
            key:'avatar',
            text:<span onClick={this.openModal}>Change Avatar</span>
        },
        {
            key:'signout',
            text:<span onClick={this.handleSignout}>SignOut</span>
        }
    ]

    handleSignout = () => {
        firebase 
            .auth()
            .signOut()
            .then(() => console.log('Signed Out'))
    }

    // CROPPING THE AVATAR IMAGE 
    handleCropImage = () => {
        if(this.avatarEditor) {
            this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
                let imageUrl = URL.createObjectURL(blob);
                this.setState({
                    croppedImage: imageUrl,
                    blob
                })
            })
        }
    };

    //UPLOADING IMAGE TO FIREBASE STORAGE
     uploadCroppedImage = () => {
        const { storageRef, userRef,blob , metadata } = this.state;

        storageRef
            .child(`avatar/user-${userRef.uid}`)
            .put(blob, metadata)
            .then( snap => {
                snap.ref.getDownloadURL().then(downloadURL => {
                    this.setState({ uploadCroppedImage: downloadURL }, () => this.changeAvatar())
                })
            })
     };

     changeAvatar = () => {
         this.state.userRef
            .updateProfile({
                photoURL: this.state.uploadCroppedImage
            })
            .then(() => {
                console.log('Photourl updated');
                this.closeModal();
            })
            .catch(err => {
                console.log(err);
            })

            this.state.usersRef
                .child(this.state.user.uid)
                .update({ avatar: this.state.uploadCroppedImage })
                .then(() => {
                    console.log('User avatar updated');
                })
                .catch(err => {
                    console.error(err)
                })
     }

    render() {
        const { user, modal, previewImage, croppedImage } = this.state;
        const { primaryColor } = this.props;
        return (
            <Grid style={{ background: primaryColor}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>

                    {/* APP HEADER */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="gamepad" />
                            <Header.Content>Connect</Header.Content>
                        </Header>

                    {/* USER DROPDOWN */}
                        <Header style={{ padding: '0.25'}} as="h4" inverted >
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>
                            }
                                options={this.dropdownOptions()} 
                            />
                        </Header>
                    </Grid.Row>

                    {/* Change User Avatar Modal */}
                    <Modal basic open={modal} onClose={this.closeModal}>
                        <Modal.Header>Change Avatar</Modal.Header>
                        <Modal.Content>
                            <Input
                                onChange={this.handleChange}
                                fluid
                                type="file"
                                label="New Avatar"
                                name="previewImage"
                            />
                            <Grid centered stackable columns={2}>
                                <Grid.Row centered>
                                    <Grid.Column className="ui center aligned grid">
                                        {/* IMAGE PREVIEW */}
                                        { previewImage && (
                                            <AvatarEditor
                                                image={previewImage}
                                                ref={node => (this.avatarEditor = node)}
                                                width={120}
                                                height={120}
                                                border={50}
                                                scale={1.2}
                                            />
                                        )}
                                    </Grid.Column>
                                    <Grid.Column>
                                        {/* CROPPED IMAGE PREVIEW  */}
                                        { croppedImage && (
                                            <Image 
                                                style={{ margin: '3.4em auto'}}
                                                width={100}
                                                height={100}
                                                src={croppedImage}
                                            />
                                        )}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Modal.Content>
                        <Modal.Actions>
                            { croppedImage && <Button color="green" inverted onClick={this.uploadCroppedImage}>
                                <Icon name="save"/> Change Avatar
                            </Button>}
                            <Button color="orange" inverted onClick={this.handleCropImage}>
                                <Icon name="image"/> Preview
                            </Button>
                            <Button color="red" inverted onClick={this.closeModal}>
                                <Icon name="remove"/> Cancel
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </Grid.Column>
            </Grid>
        );
    }
}


export default UserPanel;