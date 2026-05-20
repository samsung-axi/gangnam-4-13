import "./App.css";
import DrawingApp from "./pages/DrawingApp";
import Home from "./pages/Home";
import Result from "./pages/Result";
import { AppProvider, useAppContext } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { isToggled, name } = useAppContext();

  return (
    <div className="App">
      {name ? (
        <div>
          <p className="noisy-person-text">떠든 사람 : {name}</p>
          <p className="pranksters-person-text">장난친 사람 : {name}</p>
        </div>
      ) : (
        null
      )}
      <div className="drawing-background">
        <DrawingApp />
      </div>
      {!isToggled ? <Home /> : <Result />}
    </div>
  );
}

export default App;
