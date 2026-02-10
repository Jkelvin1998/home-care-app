import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import HealthRecord from './pages/HealthRecord';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
   return (
      <BrowserRouter>
         <Navbar />
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/health-record" element={<HealthRecord />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
         </Routes>
      </BrowserRouter>
   );
}
