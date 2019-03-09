import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { Button } from "../../views/design/Button";
import {getDomain} from "../../helpers/getDomain"

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
  height: 700px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const Container = styled.div`
  margin: 5px 0;
  width: 220px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const LoginContainer = styled.div`
  margin: 5px 0;
  width: 550px;
  height: 270px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  margin-right: 10px;
  border: none;
  border-radius: 20px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 5px;
  margin-top: 10px;
  text-transform: uppercase;
`;

const InfoText = styled.label`
  color: dimgray;
  margin-bottom: 3px;
  margin-top: 5px;
  font-size: 5px;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

class UserProfileEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            currPw: "",
            newPw: "",
            confPw: "",
            birthdate: null,
            birthdateStr: null,
            isProfileOwner: false
        };
        this.today = new Date();
    }

    componentDidMount() {
        fetch(`${getDomain()}/users/${localStorage.getItem("visitedUserId")}`)
            .then(response => response.json())
            .then(user => {
                console.log(`INFO: username = ${user.username}`);
                console.log(`INFO: visitedUserID = ${user.id}`);
                this.setState({isProfileOwner: localStorage.getItem("visitedUserId") === localStorage.getItem("loggedInUserId")});
                this.setState({id: user.id});
                this.setState({username: user.username});
                this.setState({firstName: user.firstName});
                this.setState({lastName: user.lastName});
                this.setState({birthdate: user.birthdate});
                this.setState({birthdateStr: user.birthdateStr});
            })
            .then(() => {
                console.log(`OK: Fetched user data for profile edit of user ${this.state.username} with id ${this.state.id}`);
                console.log(`INFO: isProfileOwner = ${this.state.isProfileOwner}`);
            })
            .catch(err => {
                console.log(`ERROR: Unable to fetch user data for profile of user ${this.state.username}`);
                console.log(`CAUSE: ${err.message}`);
            });
    }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    updateUserData() {
        var validUpdate = true;
        //TODO: implement fetch PUT edit user
        if(validUpdate) {
            fetch(`${getDomain()}/users/${this.state.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: this.state.id,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    birthdate: this.state.birthdate,
                    password: this.state.password,
                    username: this.state.username
                })
            })
                .then(() => {
                        return this.redirectProfile(true);
                    }
                )
                .catch(err => {
                    console.log(`ERROR: Unable to update user data for user ${this.state.username}`);
                    console.log(`CAUSE: ${err.message}`);
                })
        } else {
            alert("Invalid Update, please review data");
        }
    }

    redirectProfile(waitBoolean) {
        if(waitBoolean) sleep(2000);
        this.props.history.push(`/users/profile/&_${this.state.username}`);
        window.location.reload();
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
                            <div>
                                <Label>Login Information</Label>
                                <LoginContainer>
                                    <div>
                                        <Label>Username</Label>
                                        <InputField
                                            placeholder={this.state.username}
                                            onChange={e => {
                                                this.handleInputChange("username", e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <p>Enter current password:</p>
                                        <InputField
                                            placeholder="Current password..."
                                            onChange={e => {
                                                this.handleInputChange("username", e.target.value);
                                            }}
                                        />
                                        Enter new password:
                                        <InputField
                                            placeholder="New password..."
                                            onChange={e => {
                                                this.handleInputChange("username", e.target.value);
                                            }}
                                        />
                                        Confirm new password:
                                        <InputField
                                            placeholder="Confirm..."
                                            onChange={e => {
                                                this.handleInputChange("username", e.target.value);
                                            }}
                                        />
                                    </div>
                                </LoginContainer>
                            </div>
                            <div>
                                <Label>Name</Label>
                                <Container>
                                    <div>
                                        <InputField
                                            placeholder={this.state.firstName}
                                            onChange={e => {
                                                this.handleInputChange("firstName", e.target.value);
                                            }}
                                        />
                                        <InputField
                                            placeholder={this.state.lastName}
                                            onChange={e => {
                                                this.handleInputChange("lastName", e.target.value);
                                            }}
                                        />
                                    </div>
                                </Container>
                                <Label>Birthdate</Label>
                                <div>
                                    <p
                                        style={{color:"white"}}
                                    >
                                        Currently set to:{" "}
                                        {this.state.birthdateStr}
                                    </p>
                                    <form action="/action_page.php">
                                        <input
                                            placeholder={this.state.birthdate}
                                            type="date"
                                            name="birthdate"
                                            min="1900-01-01"
                                            max="2019-03-13"
                                            onChange={e => {
                                                this.handleInputChange("birthdate", e.target.value);
                                            }}

                                            {...() => {
                                                let dd = this.today.getDate();
                                                let mm = this.today.getMonth();
                                                let yyyy = this.today.getFullYear();
                                                if (dd < 10) {
                                                    dd = '0' + dd;
                                                }
                                                if (mm < 10) {
                                                    mm = '0' + mm;
                                                }
                                                let todayStr = yyyy + '-' + mm + '-' + dd;
                                                document.getElementById("date").setAttribute("max", todayStr);
                                            }}
                                        />
                                    </form>
                                </div>
                            </div>
                            <div>
                                <ButtonContainer>
                                    <Button
                                        width="50%"
                                        onClick={() => {
                                            return this.redirectProfile(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        width="50%"
                                        onClick={() => {
                                            return this.updateUserData();
                                        }}
                                    >
                                        Save Changes
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