import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Checkout from './pages/Checkout';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Pilates from './pages/Pilates';
import AdminDashboard from './pages/AdminDashboard';

import Verify from './pages/Verify';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Booking />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><AdminDashboard /></RequireAuth>} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pilates" element={<Pilates />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </PageTransition>
    </Router>
  );
}

export default App;
