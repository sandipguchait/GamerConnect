import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';

import { BrowserRouter, Switch , Route, withRouter } from 'react-router-dom';
import firebase from './firebase';
//components
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';

//IMPORTING ALL REDUX PACKAGES
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/index';

const store = createStore( rootReducer , composeWithDevTools());

class Root extends React.Component {

    //Checking Whether we have an user on the app so will be redirected automatically to APP
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                console.log(user)
                this.props.history.push('/');
            }
        })
    }
    render(){
        return(
            <Switch>
                <Route exact path="/" component={App}/>
                <Route  path="/login" component={Login}/>
                <Route  path="/register" component={Register}/>
            </Switch>
        );
    }
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <RootWithAuth />
        </BrowserRouter>
    </Provider>,
document.getElementById('root'));

