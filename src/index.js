import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';

import { BrowserRouter, Switch , Route, withRouter } from 'react-router-dom';
import firebase from './firebase';
//components
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';


class Root extends React.Component {

    //Checking Whether we have an user on the app (LoggedIn)
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
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
    <BrowserRouter>
        <RootWithAuth />
    </BrowserRouter>,
document.getElementById('root'));

