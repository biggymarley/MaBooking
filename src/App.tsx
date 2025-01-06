import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingManagement from './pages/BookingManagement';
import RoomListing from './pages/RoomListing';
import RoomDashboard from './pages/roomManagement';
import { Layout } from './layout/Sidebar';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RoomListing />} />
          <Route path="/rooms" element={<RoomDashboard />} />
          <Route path="/bookings" element={<BookingManagement />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
