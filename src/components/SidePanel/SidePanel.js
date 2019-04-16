import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';

class Sidepanel extends Component {

    render() {
        const { currentUser } = this.props;
        return (
            <Menu
              size="large"
              inverted
              fixed="left"
              vertical
              style={{ background: '#3276FF', fontSize: '1.2rem'}}
            >
                <UserPanel currentUser={currentUser} />
                <Channels currentUser={currentUser} />
                <DirectMessages currentUser={currentUser}/>
            </Menu>
        );
    }
}

export default Sidepanel;