import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

class Starred extends Component {

    render() {
        return (
            <Menu.Menu className="menu">
                <Menu.Item>
                    <span>
                        <Icon name="star" /> STARRED
                    </span>{" "}
                    ({ starredChannels.length})
                </Menu.Item>
                {/* SHOW CHANNELS */}
                {this.displayChannels(starredChannels)}
            </Menu.Menu>
        );
    }
}

export default Starred;