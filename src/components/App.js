import React from 'react';
import './App.css';
import { Grid, GridColumn } from 'semantic-ui-react';
import { connect } from 'react-redux';

//importing components
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => (

  <Grid columns="equal" className="app" style={{ background: '#eee'}}>
    <ColorPanel/>
    <SidePanel 
      key={ currentUser && currentUser.uid }
      currentUser={currentUser} 
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
        key={ currentChannel && currentChannel.id}
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
    userPosts: state.channel.userPosts
  }
}

export default connect(mapStateToProps)(App);
