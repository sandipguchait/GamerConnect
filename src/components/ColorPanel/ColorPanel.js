import React, { Component } from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';


class ColorPanel extends Component {

    render() {
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
            <Button icon="add" size="small" color="black" />
            </Sidebar>
        );
    }
}

export default ColorPanel;