import { combineReducers } from 'redux';

const initialUserState = {
    currentUser: null,
    isloading: true
}

const user_reducer = ( state = initialUserState, action ) => {
    switch(action.type){
        case 'SET_USER':
            return {
                currentuser: action.payload.currentUser,
                isloading: false
            }
        default:
            return state;
    }
}


const RootReducer = combineReducers({
    user: user_reducer
})

export default RootReducer;