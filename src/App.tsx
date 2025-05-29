import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './page/home';
import Prediction from './page/prediction';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
        </Routes>
      </Router>
  );
}

export default App;