import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const useNavigateAuthUser = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (auth.user) navigate('/employee-goals', { replace: true })
    }, [auth.user])
    return auth;
}

export default useNavigateAuthUser;