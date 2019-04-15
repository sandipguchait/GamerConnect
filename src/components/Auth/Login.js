import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

//Importing firebase
import firebase from "../../firebase";



class Login extends Component {

  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };


  

  //DISPLAY THE ERRORS
  displayErrors = errors => {
    return errors.map(( error , i) => (
      <p key={i}>{error.message}</p>
    ))
  }


  //Showing INPUT ERRORS MESSAGES WITH CLASSNAMES
  handleInputError = ( errors, inputName ) => {
    return errors.some( error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
  }

  
  //FORM INPUT DETAILS 
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };


  //FORM SUBMIT
  handleSubmit = (event) => {
    //checking of validation
    event.preventDefault();
    if(this.isformvalid(this.state)) {
    //setting errors to null and loading true as we are submitting 
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            this.setState({ loading: false })
        })
        .catch(err => {
            console.error(err);
            this.setState({
                errors: this.state.errors.concat(err),
                loading: false
            });
        }) ;
    }
  };


  // CHECKING FORM 
  isformvalid = ({ email, password }) => {
      //check if there is email && password
      return email && password 
  }


  render() {
    const { email, password, errors , loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="gamepad" color="violet" />
            Login to GamerConnect
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                type="email"
                value={email}
                className={this.handleInputError(errors, 'email')}
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                type="password"
                value={password}
                className={this.handleInputError(errors, 'password')}
              />

              <Button disabled={loading} className={ loading ? 'loading': ''} 
                color="violet" fluid size="large" >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Dont't have an account? <Link to="/register"> Register </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
