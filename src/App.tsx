import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import HealthRecord from './pages/HealthRecord';

export default function App() {
   return (
      <BrowserRouter>
         <Navbar />
         <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/health-record" element={<HealthRecord />} />
         </Routes>
      </BrowserRouter>
   );
}
