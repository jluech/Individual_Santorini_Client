import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
//import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import {getDomain} from "../../helpers/getDomain"
//import EditForm from "../components/EditForm"
// //TODO: write separate EditForm class

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

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
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
`;

const Username = styled.div`
  font-weight: bold;
  color: #06c4ff;
  margin-bottom: 10px;
`;

const FirstName = styled.div`
  font-weight: bold;
  color: #06c4ff;
  margin-right: 5px;
  margin-bottom: 10px;
`;

const LastName = styled.div`
  font-weight: bold;
  color: #06c4ff;
  margin-bottom: 10px;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  margin-top: 10px;
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
        //this.id = this.props.match.params.id;
        this.state = {
            firstName: null,
            lastName: null,
            username: null,
            isLoggedInUser: "",
            id: null,
            user: "",
            profileEditable: false
        };
    }

    handleEditOnClick = () => {
        this.setState((state) => {
            return {profileEditable: !state.profileEditable}
        })
    };

    handleStateChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    componentDidMount() {
        fetch(`${getDomain()}/users/${localStorage.getItem("VisitedUserId")}`)
            .then(response => response.json())
            .then(user => {
                //this.user = user.user;
                console.log(`username: ${user.username}`);
                this.setState({isLoggedInUser: user.username});
                this.setState({id: user.id});
                this.setState({username: user.username});
                this.setState({firstName: user.firstName});
                this.setState({lastName: user.lastName});
            })
            .then(() => {
                console.log(`OK: Fetched user data for user ${this.state.isLoggedInUser} with id ${this.state.id}`);
            })
        .catch(err => {
            console.log(`ERROR: Unable to fetch user data for user ${this.state.username}`);
            console.log(`Cause: ${err.message}`);
        });
        /*
        let badRequestFlag = false;
        fetch(`${getDomain()}/users/${this.state.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if(response.status === 400) {//400: BAD REQUEST
                    console.log(`BAD REQUEST: Unable to fetch user data for user ${this.state.username} with id ${this.state.id}`);
                    badRequestFlag = true;
                }
            })
            .then(response => {
                if(!badRequestFlag) return response.json()
            })
            .then(user => {
                if(!badRequestFlag) this.setState({user: user})
            })
        .catch(err => {
            console.log(`ERROR: Unable to fetch user data for user ${this.state.username} with id ${this.state.id}`);
            console.log(`ERROR: Cause: ${err.message}`);
            //alert(`Something went wrong when fetching user data: ${err.message}`);
        });*/
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
                            <Container>
                                <div>
                                    <Username>{this.state.username}</Username>
                                </div>
                            </Container>
                            <Label>Name</Label>
                            <Container>
                                <div>
                                    <FirstName>{this.state.firstName}</FirstName>
                                    <LastName>{this.state.lastName}</LastName>
                                </div>
                            </Container>
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
