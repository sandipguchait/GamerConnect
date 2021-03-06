
// USER ACTIONSSSS
// action to get the Current User
export const setUser = user => {
    return {
        type:'SET_USER',
        payload: {
            currentUser: user
        }
    }
}

//Clear User on SIGNOUT
export const clearUser = () => {
    return {
        type: 'CLEAR_USER'
    }
}

//CHANNEL ACTIONS +++++++
//change Channel action 
export const setCurrentChannel = ( channel ) => {
    return {
        type: 'SET_CURRENT_CHANNEL',
        payload: {
            currentChannel: channel
        }
    }
}

export const setPrivateChannel = (isPrivateChannel) => {
    return {
        type: 'SET_PRIVATE_CHANNEL',
        payload: {
            isPrivateChannel
        }
    }
}

export const setUserPosts = (userPosts) => {
    return {
        type: 'SET_USER_POSTS',
        payload: {
            userPosts
        }
    }
}

export const setColors = ( primaryColor , secondaryColor ) => {
    return {
        type: 'SET_COLORS',
        payload: {
            primaryColor,
            secondaryColor
        }
    }
}