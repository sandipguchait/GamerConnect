import { combineReducers } from 'redux';

const initialUserState = {
    currentUser: null,
    isLoading: true
}

const user_reducer = ( state = initialUserState, action ) => {
    switch(action.type){
        case 'SET_USER':
            return {
                currentuser: action.payload.currentUser,
                isLoading: false
            }
        default:
            return state;
    }
}


const rootReducer = combineReducers({
    user: user_reducer
})

export default rootReducer;