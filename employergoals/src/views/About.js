import styled from "styled-components";
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
      <div>
        This is the about page
      </div>
    </AppContainer>

    </>
  );
}

export default App;