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
import md5 from 'md5';
import { Link } from "react-router-dom";

//Importing firebase
import firebase from "../../firebase";



class Register extends Component {

  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmatiom: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('users')
  };


  //form validation
  isformvalid = () => {
    let errors = [];
    let error;

    if(this.isFormEmpty(this.state)){
      //throw error
      error = { message: 'Fill in all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;

    } else if (!this.isPasswordValid(this.state)){
      //throw error
      error = { message: 'Password is invalid'};
      this.setState({ errors: errors.concat(error) });
      return false;

    } else {
      //form valid 
      return true;
    }
  }


  // Checking If form is empty
  isFormEmpty = ({ username, email, password, passwordConfirmatiom }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmatiom.length ;
  }


  //Checking if the password is valid
  isPasswordValid = ({ password, passwordConfirmatiom }) => {
    if( password.length < 6 ||  passwordConfirmatiom.length < 6 ) {
      return false;
    } else if ( password !== passwordConfirmatiom ){
      return false;
    } else {
      return true;
    }
  }

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
    if(this.isformvalid()) {
    //setting errors to null and loading true as we are submitting 
      this.setState({ errors: [], loading: true });
    //sending data to firebase
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((createdUser) => {
        console.log(createdUser);
        createdUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
        })
        .then(() => {
          this.saveUser(createdUser)
          this.setState({ loading: false})
        }).then(()=>{
          console.log('user saved')
        })
        .catch( err => {
          console.error(err);
          this.setState({ errors: this.state.errors.concat(err), loading: false })
        })
      })
      .catch((err) => {
        console.error(err);
        this.setState({ errors: this.state.errors.concat(err), loading: false})
      });
    }
  };

  //SAVE USER TO FIREBASE REALTIME DATABASE
  saveUser = (createdUser) => {
    this.state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    })
  }



  render() {
    const { username, email, password, passwordConfirmatiom , errors , loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="gamepad" color="violet" />
            Register for GamerConnect
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                type="text"
                value={username}
              />

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

              <Form.Input
                fluid
                name="passwordConfirmatiom"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                onChange={this.handleChange}
                type="password"
                value={passwordConfirmatiom}
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
            Already an user? <Link to="/login"> Login </Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
