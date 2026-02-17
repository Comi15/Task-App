import { NavLink } from "react-router-dom";
import "../styles/navBar.css";
import { useContext } from "react";
import { authContext } from "../contexts/authContextProvider";

type NavBarProps = {
  children?:React.ReactNode;
}
const NavBar = ({children}:NavBarProps) => {
  const { currentUser, logOut } = useContext(authContext);
  const handleClick = () => {
    logOut();
  };
  return (
    <>
      <nav className="navBar">
        {children}
        
        {currentUser && (
          <NavLink to="/" className="nav-link" onClick={handleClick}>
            LogOut
          </NavLink>
        )}
      </nav>
    </>
  );
};

export default NavBar;
