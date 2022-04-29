import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink
} from './NavbarElements';
import { default as logo } from '../../images/logo.svg'
import { useAuth } from '../../context/authContext';


const Navbar = () => {
  const auth = useAuth();
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <img src={logo}
            style={{ height: 70, width: 70 }}
            alt="logo" />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/about'>
            About
          </NavLink>
        </NavMenu>
        {auth.user ? <NavBtn onClick={auth.logoutHandler}>
          <NavBtnLink to='/'>Logout</NavBtnLink>
        </NavBtn> : (
          <NavBtn>
            <NavBtnLink to='/signup'>Sign In/Register</NavBtnLink>
          </NavBtn>
        )}
      </Nav>
    </>
  );
};

export default Navbar;