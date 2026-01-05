import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SkillsPage from './pages/SkillsPage';
import WeeksPage from './pages/WeeksPage';
import MediaPage from './pages/MediaPage';
import ShipLogPage from './pages/ShipLogPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/weeks" element={<WeeksPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/ship" element={<ShipLogPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
