import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const withAuth = WrappedComponent => props => {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!auth.user) navigate('/signup', { replace: true });
    }, [auth.user])
    return auth.user && <WrappedComponent auth={auth} {...props} />
}


export default withAuth;