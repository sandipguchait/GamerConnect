// action to get the Current User
export const setUser = user => {
    return {
        type:'SET_USER',
        payload: {
            currentUser: user
        }
    }
}