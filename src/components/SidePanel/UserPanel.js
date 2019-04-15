import React, { Component } from 'react';
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react';


class UserPanel extends Component {

    dropdownOptions = () => [
        {
            key: 'user',
            text:<span>Signed in as <strong>User</strong></span>,
            disabled: true
        },
        {
            key:'avatar',
            text:<span>Change Avatar</span>
        },
        {
            key:'signout',
            text:<span>SignOut</span>
        }
    ]

    render() {
        return (
            <Grid style={{ background: '#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>

                    {/* APP HEADER */}
                        <Header inverted floated="left" as="h2">
                            <Icon name="gamepad" />
                            <Header.Content>GConnect</Header.Content>
                        </Header>
                    </Grid.Row>

                    {/* USER DROPDOWN */}
                    <Header style={{ padding: '0.25'}} as="h4" inverted >
                        <Dropdown text="User" options={this.dropdownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserPanel;