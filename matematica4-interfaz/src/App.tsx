/**
 * App.tsx - Configuración principal con React Router
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import Dashboard from './pages/Dashboard';
import LimitExplorer from './scenarios/LimitExplorer/LimitExplorer';
import DerivativeLab from './scenarios/DerivativeLab/DerivativeLab';
import ExtremeHunter from './scenarios/ExtremeHunter/ExtremeHunter';
import GradientNavigator from './scenarios/GradientNavigator/GradientNavigator';
import FieldInspector from './scenarios/FieldInspector/FieldInspector';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="limites" element={<LimitExplorer />} />
          <Route path="limitexplorer" element={<LimitExplorer />} />
          <Route path="derivadas" element={<DerivativeLab />} />
          <Route path="derivativelab" element={<DerivativeLab />} />
          <Route path="lagrange" element={<ExtremeHunter />} />
          <Route path="extremehunter" element={<ExtremeHunter />} />
          <Route path="gradiente" element={<GradientNavigator />} />
          <Route path="gradientnavigator" element={<GradientNavigator />} />
          <Route path="campos" element={<FieldInspector />} />
          <Route path="fieldinspector" element={<FieldInspector />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
