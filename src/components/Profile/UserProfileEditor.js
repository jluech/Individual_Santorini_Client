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

const Birthdate = styled.div`
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

class UserProfileEditor extends React.Component {
    constructor(props) {
        super(props);
        //this.id = this.props.match.params.id;
        this.state = {
            firstName: null,
            lastName: null,
            username: null,
            birthdate: null,
            isProfileOwner: false,
            id: null,
            user: "",
            profileEditable: false
        };
    }

    componentDidMount() {
        fetch(`${getDomain()}/users/${localStorage.getItem("visitedUserId")}`)
            .then(response => response.json())
            .then(user => {
                //this.user = user.user;
                console.log(`INFO: username = ${user.username}`);
                console.log(`INFO: visitedUserID = ${user.id}`);
                this.setState({isProfileOwner: localStorage.getItem("visitedUserId") === localStorage.getItem("loggedInUserId")});
                //console.log(`INFO: value of isProfileOwner = ${this.state.isProfileOwner}`);
                this.setState({id: user.id});
                this.setState({username: user.username});
                this.setState({firstName: user.firstName});
                this.setState({lastName: user.lastName});
                this.setState({birthdate: user.birthdateStr});
            })
            .then(() => {
                console.log(`OK: Fetched user data for user ${this.state.username} with id ${this.state.id}`);
                console.log(`INFO: isProfileOwner = ${this.state.isProfileOwner}`);
            })
            .catch(err => {
                console.log(`ERROR: Unable to fetch user data for user ${this.state.username}`);
                console.log(`CAUSE: ${err.message}`);
            });
    }

    redirectProfile() {
        this.props.history.push(`/users/profile/&_${this.state.username}`);
    }

    render() {
        if (localStorage.getItem("token") == null ) {
            return (
                <h1
                    style={{color:"white"}}
                    align="center"
                >
                    Please log in to see any content!
                </h1>
            )
        } else {
            return (
                <BaseContainer>
                    <FormContainer>
                        <Form>
                            <Label>Currently in Edit Profile</Label>

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
                            <Label>Birthdate</Label>
                            <Container>
                                <div>
                                    <Birthdate>{this.state.birthdate}</Birthdate>
                                </div>
                            </Container>
                            <div>
                                <ButtonContainer>
                                    <Button
                                        width="50%"
                                        onClick={() => {
                                            return this.redirectProfile();
                                        }}
                                    >
                                        Back to Profile
                                    </Button>
                                </ButtonContainer>
                            </div>
                        </Form>
                    </FormContainer>
                </BaseContainer>
            );
        }
    }
}

export default UserProfileEditor;