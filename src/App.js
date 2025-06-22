import './App.css';
import { Route, Routes } from 'react-router-dom'
import Shop from './pages/shop/Shop'
import Home from './pages/home/Home'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={'/'} element={<Shop />} />
        <Route path={'/home'} element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
