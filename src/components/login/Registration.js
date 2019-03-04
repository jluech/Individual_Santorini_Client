import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
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
  margin-inside: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 550px;
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
  //margin-top: 20px;
`;

class Registrator extends React.Component {
    constructor() {
        super();
        this.state = {
            firstname: null,
            lastname: null,
            username: null,
            password: null
        };
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    componentDidMount() {}

    redirectLogin() {
        this.props.history.push(`/login`);
    }

    register() {
        var existingUser = new User();
        //var date = new Date();
        //var timestamp = date.getTime();

        fetch("${getDomain()}/users/{getUsername()}", { //check for existing user
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then(response => response.json())
            .then(returnedUser => {
                existingUser = new User(returnedUser);
                //returnedUser.print();
            });
        if(existingUser.username !== this.state.username || existingUser.password !== this.state.password) {//if inexistent register new user

            //NON-FUNCTIONAL CHECK FOR EXISTING USER!!

            //alert("Got to second fetch");
            fetch(`${getDomain()}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    birthdate: this.state.birthdate,
                    password: this.state.password,
                    username: this.state.username
                })
            })
            .catch(err => {//error during 2nd fetch
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                /**} else if(existingUser.username == null) {
                    alert("User not existing. You should register first");*/
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
            this.props.history.push(`/login`);
            alert("Registration successful. Try logging in with your new user credentials");
        } else {
            alert("User already existing");
        }
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>First Name</Label>
                        <InputField
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange("firstname", e.target.value);
                        }}
                        />
                        <Label>Last Name</Label>
                        <InputField
                        placeholder="Enter here.."
                        onChange={e => {
                            this.handleInputChange("lastname", e.target.value);
                        }}
                        />
                        <Label>Birthdate *</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("birthdate", e.target.value);
                            }}
                        />
                        <Label>Username *</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("username", e.target.value);
                            }}
                        />
                        <Label>Password *</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    return this.redirectLogin();
                                }}
                            >
                                Back to Login
                            </Button>
                            <Button
                                disabled={!this.state.username || !this.state.password || !this.state.birthdate}
                                width="50%"
                                onClick={() => {
                                    this.register();
                                }}
                            >
                                Register
                            </Button>
                        </ButtonContainer>
                        <p>
                            Fields marked with a * may not be empty.
                        </p>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Registrator);
