import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import User from "../shared/models/User";
//import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import {getDomain} from "../../helpers/getDomain";

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

const TextField = styled.div`
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
`

const FirstName = styled.div`
  font-weight: bold;
  color: #06c4ff;
  margin-right: 5px;
`;

const LastName = styled.div`
  font-weight: bold;
  color: #06c4ff;
  margin-right: 10px;
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

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.id = this.props.match.id;
        this.state = {
            firstName: null,
            lastName: null,
            username: null
        };
        this.user = new User();
    }

    handleStateChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    componentDidMount() {
        this.getUserData();
    }

    getUserData() {
        fetch(`${getDomain()}/users/id/${this.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then((response) => {
                this.user = response.user;
                this.handleStateChange("username", response.username);
                this.handleStateChange("firstName", response.firstName);
                this.handleStateChange("lastName", response.lastName);
                console.log(`OK: Fetched user data for user ${this.state.username}`)
            })
        .catch(err => {
            console.log(`ERROR: Unable to fetch user data for user ${this.state.username}`);
            alert(`Something went wrong during the login: ${err.message}`);
        })
    }

    redirectGame() {
        this.props.history.push(`/game`);
    }

    render() {
        if (localStorage.getItem("token") == null ) {
            return (
                <h1> Please log in to see content.</h1>
            )
        } else {
            return (
                <BaseContainer>
                    <FormContainer>
                        <Form>
                            <Label>Username</Label>
                            <TextField>{this.state.username}</TextField>
                            <div>
                                <Label>Name</Label>
                                <FirstName>{this.state.firstName}</FirstName>
                                <LastName>{this.state.lastName}</LastName>
                            </div>
                            <ButtonContainer>
                                <Button
                                    width="50%"
                                    onClick={() => {
                                        return this.redirectGame();
                                    }}
                                >
                                    Back to Dashboard
                                </Button>
                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                </BaseContainer>
            );
        }
    }
}

//export default withRouter(UserProfile);
export default UserProfile;
