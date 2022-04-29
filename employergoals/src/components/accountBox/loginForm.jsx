import React, { useState, useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  MutedLink,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { toast, ToastContainer } from 'react-toastify';
import useNavigateAuthUser from "../../hooks/useNavigateAuthUser";

export function LoginForm(props) {
  const auth = useNavigateAuthUser();
  const { switchToSignup } = useContext(AccountContext);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');


  const handleLogin = async (event) => {
    event.preventDefault()
    auth.loginHandler({ email, password })
      .catch(err => {
        toast.error('Wrong credentials')
      })
  }
  return (
    <BoxContainer>
      <FormContainer>
        <Input type="email" placeholder="Email" onChange={({ target }) => setEmail(target.value)} />
        <Input type="password" placeholder="Password" onChange={({ target }) => setPassword(target.value)} />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <Marginer direction="vertical" margin="1.6em" />
      <SubmitButton type="submit" onClick={handleLogin}>Signin</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink>
        Don't have an account?{" "}
        <BoldLink href="#" onClick={switchToSignup}>
          Signup
        </BoldLink>
      </MutedLink>
      <ToastContainer />
    </BoxContainer>
  );
}
