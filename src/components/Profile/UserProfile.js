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
  height: 650px;
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

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        //this.id = this.props.match.params.id;
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            birthdate: "",
            creationdate: "",
            onlineStatus: null,
            isProfileOwner: false,
            id: null,
            //user: null,
            profileEditable: false
        };
    }

    componentDidMount() {
        //alert(`${window.location.pathname.substr(window.location.pathname.lastIndexOf('_')+1)}`);//extracts username out of path
        fetch(`${getDomain()}/users/username/${window.location.pathname.substr(window.location.pathname.lastIndexOf('_')+1)}`)
            .then(response => response.json())
            .then(user => {
                console.log(`INFO: username = ${user.username}`);
                localStorage.setItem("visitedUserId", user.id);
                console.log(`INFO: visitedUserID = ${localStorage.getItem("visitedUserId")}`);
                this.setState({isProfileOwner: localStorage.getItem("visitedUserId") === localStorage.getItem("loggedInUserId")});
                //console.log(`INFO: value of isProfileOwner = ${this.state.isProfileOwner}`);
                this.setState({id: user.id});
                this.setState({username: user.username});
                this.setState({firstName: user.firstName});
                this.setState({lastName: user.lastName});
                this.setState({birthdate: user.birthdateStr});
                this.setState({creationdate: user.creationDateStr});
                this.setState({onlineStatus: user.status})
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

    redirectGame() {
        this.props.history.push(`/game`);
    }

    redirectEditProfile() {
        this.props.history.push(`/users/profile/editor/&_${this.state.username}`);
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
                            <Label>Creation Date</Label>
                            <Container>
                                <div>
                                    <Birthdate>{this.state.creationdate}</Birthdate>
                                </div>
                            </Container>
                            <Label>Online Status</Label>
                            <Container>
                                <div>
                                    <Birthdate>{this.state.onlineStatus}</Birthdate>
                                </div>
                            </Container>
                            <div>
                                <ButtonContainer>
                                    <Button
                                        width="50%"
                                        onClick={() => {
                                            return this.redirectGame();
                                        }}
                                    >
                                        Back to Dashboard
                                    </Button>
                                    {this.state.isProfileOwner ?
                                        <Button
                                            width="50%"
                                            onClick={() => {
                                                return this.redirectEditProfile();
                                            }}
                                        >
                                            Edit Profile
                                        </Button> : ""
                                    }
                                </ButtonContainer>
                            </div>
                        </Form>
                    </FormContainer>
                </BaseContainer>
            );
        }
    }
}

//export default withRouter(UserProfile);
export default UserProfile;
