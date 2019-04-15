import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';

import { BrowserRouter, Switch , Route, withRouter } from 'react-router-dom';
import firebase from './firebase';

//components
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Spinner from './Spinner';

//IMPORTING ALL REDUX PACKAGES
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/index';
import { setUser } from './actions/index'; 
const store = createStore( rootReducer , composeWithDevTools());

class Root extends React.Component {

    //IF user is Logged In then automatically user is redirected to APP component 
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.props.setUser(user)
                this.props.history.push('/');
            }
        })
    }

    render(){
        return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App}/>
                <Route  path="/login" component={Login}/>
                <Route  path="/register" component={Register}/>
            </Switch>
        );
    }
}

//getting the isLoading property from global state to show spinner
const mapStateToProps = state => {
   return {
       isLoading: state.user.isLoading
   }
}

const RootWithAuth = withRouter(connect(mapStateToProps, {setUser})(Root));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <RootWithAuth />
        </BrowserRouter>
    </Provider>,
document.getElementById('root'));

