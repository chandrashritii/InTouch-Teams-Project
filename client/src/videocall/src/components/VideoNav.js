import * as React from "react";
import {Navbar} from "react-bootstrap";

const Header = ({children}) => (
    <Navbar className="justify-content-between bg-app" expand="lg" sticky="top" variant="light">
    <Navbar.Brand href="/">
    </Navbar.Brand>
    {children || null}
  </Navbar>
);

export default Header;