import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

export const Header = () => {
  return (
    <div>
      <Navbar className="nav header" fixed="top" expand="lg" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand>Pavel Batalov</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/assignment2">
              <Nav.Link>Assignment 2</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/assignment3">
              <Nav.Link>Assignment 3</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/final">
              <Nav.Link>Final</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
