import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import { BrowserRouter, Switch , Route } from 'react-router-dom';

//components
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';



const Root = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App}/>
            <Route  path="/login" component={Login}/>
            <Route  path="/register" component={Register}/>
        </Switch>
    </BrowserRouter>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
