import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import {withRouter} from "react-router-dom";//removed import for 'Redirect'
import { Button } from "../../views/design/Button";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const RegisterFormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100px;
  justify-content: center;
`;

const RegisterForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 100px;
  font-size: 10px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Login extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: lastname and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      validPassword: false
    };
  }

  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
   */
  login() {
    fetch(`${getDomain()}/users/username/`+this.state.username, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })
      .then(response => response.json())
      .then(returnedUser => {
        const user = new User(returnedUser);

        if(!(this.state.username === null || this.state.username === "" || this.state.password === null || this.state.password === "")) {//valid data entry
          if (!(user.username === null || user.username === undefined || user.password === null || user.password === undefined)) {//existing user
            fetch(`${getDomain()}/validate/password/${this.state.password}/${user.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json"
              }
            })
                .then(response => {
                  if (response.status === 202) {
                    console.log(`OK: Validating password with status ${response.status}`);

                    // store the token into the local storage
                    localStorage.setItem("token", user.token);
                    localStorage.setItem("loggedInUserId", user.id);
                    localStorage.setItem("loggedInUserUsername", user.username);
                    console.log(`INFO: Logged in as user ${localStorage.getItem("loggedInUserId")} with token ${localStorage.getItem("token")}`);

                    fetch(`${getDomain()}/users/login/${this.state.username}`, {//setting online status to ONLINE
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json"
                      }
                    })
                        .then(() => {
                          // user login successfully worked --> navigate to the route /game in the GameRouter
                          this.props.history.push(`/game`);
                        })
                        .catch(err => {
                          console.log(`ERROR: Unable to set status for user ${this.state.username}`);
                          console.log(`CAUSE: ${err.message}`);
                        });
                  } else {
                    alert("Wrong Password. Try again"); //deliberately only informing about wrong password and neglecting possibly wrong/non-existent username for security reasons
                    console.log(`ERROR: Validating password with status ${response.status}`);
                  }
                })
                .catch(err => {
                  console.log(`ERROR: Unable to validate password for user ${this.state.username}`);
                  console.log(`CAUSE: ${err.message}`);
                });
          } else {
            alert("Wrong Password. Try again"); //deliberately only informing about wrong password and neglecting possibly wrong/non-existent username for security reasons
            console.log("Wrong password! Try again");
          }
        } else {
          console.log(`Invalid entry`);
          alert("Invalid data entry!");
        }
      })
      .catch(err => {
        if (err.message.match(/Failed to fetch/)) {
          alert("The server cannot be reached. Did you start it?");
          console.log(`ERROR: Server cannot be reached. Did you start it?`);
          console.log(`CAUSE: ${err.message}`);
        } else {
          console.log(`ERROR: Something went wrong during login for user ${this.state.username}`);
          console.log(`CAUSE: ${err.message}`);
        }
      });
  }

  redirectRegistrator() {
    this.props.history.push(`/registration`);
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <BaseContainer>
        <FormContainer>
          <Form>
            <Label>Username</Label>
            <InputField
              placeholder="Enter here..."
              onChange={e => {
                this.handleInputChange("username", e.target.value);
              }}
            />
            <Label>Password</Label>
            <InputField
                type="password"
                placeholder="Enter here..."
                onChange={e => {
                  this.handleInputChange("password", e.target.value);
                }}
            />
            <ButtonContainer>
              <Button
                disabled={!this.state.username || !this.state.password}
                width="50%"
                onClick={() => {
                  this.login();
                }}
              >
                Login
              </Button>
            </ButtonContainer>
          </Form>
        </FormContainer>
        <RegisterFormContainer>
          <RegisterForm>
            <Label>
              Need to register a new User?
            </Label>
            <Button
              width="50%"
              onClick={() => {
                return this.redirectRegistrator();
              }}
            >
              Register
            </Button>
          </RegisterForm>
        </RegisterFormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
