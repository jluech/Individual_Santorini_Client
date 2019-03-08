import React from "react";
import styled from "styled-components";
import Link from "react-router-dom/es/Link";

const Container = styled.div`
  margin: 6px 0;
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: 1px solid #ffffff26;
`;

const UserName = styled.div`
  font-weight: lighter;
  margin-left: 5px;
  margin-right: 15px;
`;

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

const Id = styled.div`
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`;

const Redirector = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover{
    color: grey;
  }
`;

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://reactjs.org/docs/components-and-props.html
 * @FunctionalComponent
 */
const Player = ({ user }) => {
  return (
      <Container>
          <Redirector
              to={`/users/profile/&_${user.username}`}
          >
              <UserName
                  onClick={() => {
                      localStorage.setItem("visitedUserId", user.id);
                      console.log(`visitedUserId: ${localStorage.getItem("visitedUserId")}`)
                  }}
              >
                  {user.username}
              </UserName>
          </Redirector>
          <FirstName>{user.firstName}</FirstName>
          <LastName>{user.lastName}</LastName>
          <Id>Id: {user.id}</Id>
      </Container>
  )
};

export default Player;
