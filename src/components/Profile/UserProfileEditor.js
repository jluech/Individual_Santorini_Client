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
  margin: 10px 0;
  width: 230px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const LoginContainer = styled.div`
  margin: 10px 0;
  width: 490px;
  height: 270px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const ProfileContainer = styled.div`
  margin: 10px 0;
  width: 500px;
  border-radius: 6px;
  display: flex;
  align-items: (flex-start) (center);
  //border: 1px solid #ffffff26;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  //margin-left: -4px;
  margin-right: 15px;
  margin-top: 5px;
  border: none;
  border-radius: 20px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  margin-top: 15px;
  margin-right: 100px;
  text-transform: uppercase;
`;

const InfoText = styled.label`
  color: darkgray;
  margin-bottom: 10px;
  margin-top: 10px;
  font-size: 15px;
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
            birthdateStr: "",
            oldFirstName: "",
            oldLastName: "",
            oldUsername: "",
            oldBirthdate: null,
            oldBirthdateStr: "",
            isProfileOwner: false
        };
        this.today = new Date();
    }

    componentDidMount() {
        fetch(`${getDomain()}/users/${localStorage.getItem("visitedUserId")}`)
            .then(response => response.json())
            .then(user => {
                //console.log(`INFO: username = ${user.username}`);
                //console.log(`INFO: visitedUserID = ${user.id}`);
                this.setState({isProfileOwner: localStorage.getItem("visitedUserId") === localStorage.getItem("loggedInUserId")});
                this.setState({id: user.id});
                this.setState({username: user.username});
                this.setState({oldUsername: user.username});
                this.setState({firstName: user.firstName});
                this.setState({oldFirstName: user.firstName});
                this.setState({lastName: user.lastName});
                this.setState({oldLastName: user.lastName});
                this.setState({birthdate: user.birthdate});
                this.setState({oldBirthdate: user.birthdate});
                this.setState({birthdateStr: user.birthdateStr});
                //this.setState({oldBirthdateStr: user.birthdateStr});
            })
            .then(() => {
                console.log(`OK: Fetched user data for profile edit of user ${this.state.username} with id ${this.state.id}`);
                //console.log(`INFO: isProfileOwner = ${this.state.isProfileOwner}`);
            })
            .catch(err => {
                console.log(`ERROR: Unable to fetch user data for profile of user ${this.state.username}`);
                console.log(`CAUSE: ${err.message}`);
            });
    }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
        //console.log(`changing ${key} to ${value}`);
    }

    updateUserData() {
        //TODO: security reason: add current password for verification along with new password to PUT fetch change password
        var hasDataUpdate = false;
        var hasPwUpdate = false;
        if((this.state.firstName !== this.state.oldFirstName)
            || (this.state.lastName !== this.state.oldLastName)
            || (this.state.username !== this.state.oldUsername)
            || (this.state.birthdate !== this.state.oldBirthdate)
        ) {
            hasDataUpdate = true;
        }
        if((this.state.currPw !== "")
            || (this.state.newPw !== "")
            || (this.state.confPw !== "") //new password data entered
        ) {
            if(this.state.currPw !== "") {
                if ((this.state.newPw !== "") && (this.state.newPw === this.state.confPw)) { //new password confirmed
                    hasPwUpdate = true;
                } else {
                    alert("Invalid password confirmation. Please fix your new password");
                }
            } else {
                alert("Empty current password!");
            }
        }

        if(hasDataUpdate && hasPwUpdate) {
            //console.log("Has Data Update and Password Update");
            let updatedData = false;
            let updatedPassword = false;
            fetch(`${getDomain()}/users/${this.state.id}`, { //try updating user data
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: this.state.id,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    username: this.state.username,
                    birthdate: this.state.birthdate
                })
            })
                .then(response => {
                    if(response.status === 204) {
                        console.log(`OK: Successfully updated data for user ${this.state.username}`);
                        alert(`Successfully updated data for user ${this.state.username}`);
                        updatedData = true;
                        if(updatedData && updatedPassword) {
                            this.redirectProfile();
                        }
                    } else {
                        console.log(`ERROR: Could not update data with status ${response.status}`)
                        alert("Could not update data");
                    }
                })
                .catch(err => {
                    console.log(`ERROR: Something went wrong during data update for user ${this.state.username}`);
                    console.log(`CAUSE: ${err.message}`);
                });

            fetch(`${getDomain()}/validate/password/${this.state.currPw}/${this.state.id}`, {//check for correct current password
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(result => {
                    if(result.status === 202) {
                        console.log(`OK: Validated password with status ${result.status}`);

                        fetch(`${getDomain()}/users/${this.state.id}`, { //try updating user password
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: this.state.id,
                                password: this.state.newPw
                            })
                        })
                            .then(response => {
                                if(response.status === 204) {
                                    console.log(`OK: Successfully updated password for user ${this.state.username}`);
                                    alert(`Successfully updated password for user ${this.state.username}`);
                                    updatedPassword = true;
                                    if(updatedData && updatedPassword) {
                                        this.redirectProfile();
                                    }
                                } else {
                                    console.log(`ERROR: Could not update password with status ${response.status}`);
                                }
                            })
                            .catch(err => {
                                console.log(`ERROR: Something went wrong during password update for user ${this.state.username}`);
                                console.log(`CAUSE: ${err.message}`);
                            })
                    } else {
                        console.log(`ERROR: Validating password with status ${result.status}`);
                    }
                })
                .catch(err => {
                    console.log(`ERROR: Unable to validate password for user ${this.state.username}`);
                    console.log(`CAUSE: ${err.message}`);
                });
        } else if(hasDataUpdate && !hasPwUpdate) {
            //console.log("Has Data Update");
            fetch(`${getDomain()}/users/${this.state.id}`, { //try updating user data
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: this.state.id,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    username: this.state.username,
                    birthdate: this.state.birthdate
                })
            })
                .then(response => {
                    if(response.status === 204) {
                        console.log(`OK: Successfully updated data for user ${this.state.username}`);
                        this.redirectProfile();
                    } else {
                        console.log(`ERROR: Could not update data with status ${response.status}`)
                    }
                })
                .catch(err => {
                    console.log(`ERROR: Something went wrong during data update for user ${this.state.username}`);
                    console.log(`CAUSE: ${err.message}`);
                })
        } else if(!hasDataUpdate && hasPwUpdate) {
            //console.log("Has Password Update");
            fetch(`${getDomain()}/validate/password/${this.state.currPw}/${this.state.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(result => {
                    if(result.status === 202) {
                        console.log(`OK: Validated password with status ${result.status}`);

                        fetch(`${getDomain()}/users/${this.state.id}`, { //try updating user password
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: this.state.id,
                                password: this.state.newPw
                            })
                        })
                            .then(response => {
                                if(response.status === 204) {
                                    console.log(`OK: Successfully updated password for user ${this.state.username}`);
                                    this.redirectProfile();
                                } else {
                                    console.log(`ERROR: Could not update password with status ${response.status}`)
                                }
                            })
                            .catch(err => {
                                console.log(`ERROR: Something went wrong during password update for user ${this.state.username}`);
                                console.log(`CAUSE: ${err.message}`);
                            })
                    } else {
                        console.log(`ERROR: Validating password with status ${result.status}`);
                    }
                })
                .catch(err => {
                    console.log(`ERROR: Unable to validate password for user ${this.state.username}`);
                    console.log(`CAUSE: ${err.message}`);
                });
        } else {
            alert("No valid update detected! Please revisit data entry");
            console.log("ERROR: No valid update for user detected");
            window.location.reload();
        }
    }

    redirectProfile(editBoolean) {
        if(editBoolean) sleep(500);
        this.props.history.push(`/users/profile/&_${this.state.username}`);
        if(editBoolean) window.location.reload();
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
                                    <div
                                        style={{marginRight: 30}}
                                    >
                                        <Label>Username</Label>
                                        <p
                                            style={{fontSize: 0.1 +"em"}}
                                        />
                                        <InputField
                                            placeholder={this.state.username}
                                            onChange={e => {
                                                this.handleInputChange("username", e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Password</Label>
                                        <p
                                            style={{fontSize: 0.1 +"em"}}
                                        />
                                        <InfoText>Enter current password:</InfoText>
                                        <InputField
                                            placeholder="Current..."
                                            onChange={e => {
                                                this.handleInputChange("currPw", e.target.value);
                                            }}
                                        />
                                        <p
                                            style={{fontSize: 0.1 +"em"}}
                                        />
                                        <InfoText>Enter new password:</InfoText>
                                        <InputField
                                            placeholder="New..."
                                            onChange={e => {
                                                this.handleInputChange("newPw", e.target.value);
                                            }}
                                        />
                                        <p
                                            style={{fontSize: 0.1 +"em"}}
                                        />
                                        <InfoText>Confirm new password:</InfoText>
                                        <InputField
                                            placeholder="Confirm..."
                                            onChange={e => {
                                                this.handleInputChange("confPw", e.target.value);
                                            }}
                                        />
                                    </div>
                                </LoginContainer>
                            </div>
                            <div>
                                <ProfileContainer>
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
                                    </div>
                                    <div
                                        style={{marginLeft: 30}}
                                    >
                                        <Label>Birthdate</Label>
                                        <Container>
                                            <div>
                                                <InfoText>
                                                    Currently set to:{" "}
                                                    {this.state.birthdateStr}
                                                </InfoText>
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
                                        </Container>
                                    </div>
                                </ProfileContainer>
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