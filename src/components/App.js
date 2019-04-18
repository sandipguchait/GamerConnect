import React from 'react';
import './App.css';
import { Grid, GridColumn } from 'semantic-ui-react';
import { connect } from 'react-redux';

//importing components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts , primaryColor , secondaryColor }) => (

  <Grid columns="equal" className="app" style={{ background: secondaryColor}}>
    <ColorPanel 
      key={currentUser && currentUser.name }
      currentUser={currentUser} 
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    />
    <SidePanel 
      key={ currentUser && currentUser.uid }
      currentUser={currentUser} 
      primaryColor={primaryColor}
    />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages 
        currentChannel={currentChannel} 
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
        key={ currentChannel && currentChannel.id } 
      />
    </Grid.Column>

    <GridColumn width={4}>
      <MetaPanel 
        key={ currentChannel && currentChannel.name}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        userPosts={userPosts}
      />
    </GridColumn>
  </Grid>

)

const mapStateToProps = state => {
  return {
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
    userPosts: state.channel.userPosts,
    primaryColor: state.colors.primaryColor,
    secondaryColor: state.colors.secondaryColor
  }
}

export default connect(mapStateToProps)(App);
