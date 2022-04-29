import styled from "styled-components";
import { AccountBox } from "../components/accountBox";
import Navbar from "../components/navbar/NavBar";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <>
    <Navbar/>
    <AppContainer>
      <AccountBox/>
    </AppContainer>

    </>
  );
}

export default App;