import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookingManagement from './pages/BookingManagement';
import RoomListing from './pages/RoomListing';
import RoomDashboard from './pages/roomManagement';
import { Layout } from './layout/Sidebar';
import { LoadingContainer } from './components/LoadingContainer';
import useLoading from './hooks/useLoading';
import { LoadingContext } from './context/loadingContext';

function App() {
  const { loading, setLoading } = useLoading()
  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<RoomListing />} />
            <Route path="/rooms" element={<RoomDashboard />} />
            <Route path="/bookings" element={<BookingManagement />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {loading ? <LoadingContainer /> : null}
        </Layout>
      </Router>
    </LoadingContext.Provider>
  );
}

export default App;
