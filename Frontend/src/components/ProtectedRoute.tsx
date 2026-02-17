import { useContext } from "react";
import { authContext } from "../contexts/authContextProvider";
import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  const { currentUser } = useContext(authContext);
  if (!currentUser) {
    return <Navigate to="/signup" />;
  }
  return <props.Component />;
};

export default ProtectedRoute;
