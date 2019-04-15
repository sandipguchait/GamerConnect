import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Button , Input , Icon } from 'semantic-ui-react';

class FileModal extends Component {
    state = {
        file: null,
        authorized: ['image/jpeg', 'image/jpg', 'image/png']
    }

    addFile = (event) => {
        const file = event.target.files[0];
        if(file){
            this.setState({ file });
        }
    };

    sendFile = () => {
        const {file} = this.state;
        const { uploadFile, closeModal } = this.props;

        if(file !== null ) {
            if(this.isAuthorized(file.name)){
                //sendFile 
                const metadata = { contentType: mime.lookup(file.name)};
                uploadFile(file, metadata);
                closeModal();
                this.clearFile();
            }
        }
    };

    // cheking the file type of the image compatible or not 
    isAuthorized = filename => {
        return this.state.authorized.includes(mime.lookup(filename));
    }

    clearFile = () => this.setState({ file: null });

    render() {
        const { modal, closeModal  } = this.props;
        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image file</Modal.Header>
                <Modal.Content>
                    <Input 
                        onChange={this.addFile}
                        fluid
                        label="File types: jpg,png"
                        type="file"
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        onClick={this.sendFile}
                        inverted
                    >
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}

export default FileModal;