import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Analytics } from './pages/Analytics';
import { Export } from './pages/Export';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="export" element={<Export />} />
      </Route>
    </Routes>
  );
}

export default App;
