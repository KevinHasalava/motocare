import { useNavigate } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

function App() {

  const navigate = useNavigate();

  return (
    <div className="App">
      <h1 className='h1'>hello</h1>
      <center><button onClick={() => navigate("/home")}>click  </button></center>
    </div>
  );
}

export default App;
