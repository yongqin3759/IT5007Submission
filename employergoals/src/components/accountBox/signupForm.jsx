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
import useNavigateAuthUser from "../../hooks/useNavigateAuthUser";
import { toast, ToastContainer } from 'react-toastify';

export function SignupForm(props) {
  const { switchToSignin } = useContext(AccountContext);
  const auth = useNavigateAuthUser();


  const [fullName, setFullName] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [email, setEmail] = useState('')

  const handleSignup = (e) => {
    e.preventDefault()
    if (password1 === password2) {
      auth.signupHandler({ fullName, email, password: password1 })
        .catch(err => {
          toast.err(toast.error(JSON.stringify(err.message)))
        })
    }
    else {
      toast.error("Passwords dont match!")
    }

  }

  return (
    <BoxContainer>
      <FormContainer>
        <Input type="text" placeholder="Full Name" onChange={({ target }) => setFullName(target.value)} />
        <Input type="email" placeholder="Email" onChange={({ target }) => setEmail(target.value)} />
        <Input type="password" placeholder="Password" onChange={({ target }) => setPassword1(target.value)} />
        <Input type="password" placeholder="Confirm Password" onChange={({ target }) => setPassword2(target.value)} />
      </FormContainer>
      <Marginer direction="vertical" margin={10} />
      <SubmitButton type="submit" onClick={handleSignup}>Signup</SubmitButton>
      <Marginer direction="vertical" margin="1em" />
      <MutedLink>
        Already have an account?
        <BoldLink onClick={switchToSignin}>
          Signin
        </BoldLink>
      </MutedLink>
      <ToastContainer/>
    </BoxContainer>
  );
}
