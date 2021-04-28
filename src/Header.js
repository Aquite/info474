import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

export const Header = () => {
  return (
    <div>
      <Navbar className="nav header" fixed="top" expand="lg" variant="dark">
        <LinkContainer to="/info474">
          <Navbar.Brand>Pavel Batalov</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/info474">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/info474/assignment2">
              <Nav.Link>Assignment 2</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
