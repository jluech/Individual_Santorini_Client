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

class UserProfile extends React.Component {
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

    redirectGame() {
        this.props.history.push(`/game`);
    }

    render() {
        return(
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
                        <Button
                            width="50%"
                            onClick={() => {
                                return this.redirectGame();
                            }}
                        >
                            Back to Game
                        </Button>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(UserProfile);
