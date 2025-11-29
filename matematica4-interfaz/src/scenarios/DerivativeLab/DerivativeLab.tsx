/**
 * Escenario 2: Laboratorio de Derivadas
 * Concepto: Laboratorio científico virtual para análisis de superficies
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { partialDerivative, evaluateFunction, formatNumber } from '../../utils/mathUtils';
import { getProblemsByObjective } from '../../data/problems';
import { useProgressStore } from '../../store/progressStore';

type CutType = 'x' | 'y' | null;

export default function DerivativeLab() {
  const [functionExpr, setFunctionExpr] = useState('x^2 * y + y^3');
  const [pointX, setPointX] = useState(1);
  const [pointY, setPointY] = useState(2);
  const [selectedCut, setSelectedCut] = useState<CutType>(null);
  const [derivatives, setDerivatives] = useState<{ fx: number | null; fy: number | null }>({
    fx: null,
    fy: null,
  });
  const [cutData, setCutData] = useState<Array<{ t: number; value: number }>>([]);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);

  const { addPoints } = useProgressStore();
  const problems = getProblemsByObjective('2');
  const currentProblem = problems[0];

  const handleCalculateDerivatives = () => {
    const point = { x: pointX, y: pointY };
    const fx = partialDerivative(functionExpr, 'x', point);
    const fy = partialDerivative(functionExpr, 'y', point);
    setDerivatives({ fx, fy });
  };

  const handleCut = (cutType: CutType) => {
    setSelectedCut(cutType);
    const data: Array<{ t: number; value: number }> = [];
    const range = 5;
    const steps = 50;

    for (let i = -steps; i <= steps; i++) {
      const t = (i / steps) * range;
      let value: number;

      if (cutType === 'x') {
        // Corte en X: mantener y fijo, variar x
        value = evaluateFunction(functionExpr, { x: pointX + t, y: pointY });
      } else {
        // Corte en Y: mantener x fijo, variar y
        value = evaluateFunction(functionExpr, { x: pointX, y: pointY + t });
      }

      if (!isNaN(value) && isFinite(value)) {
        data.push({ t: cutType === 'x' ? pointX + t : pointY + t, value });
      }
    }

    setCutData(data);
  };

  const handleCheckAnswer = () => {
    if (derivatives.fx === null || derivatives.fy === null) {
      alert('Primero calcula las derivadas parciales.');
      return;
    }

    const correctAnswer = currentProblem.correctAnswer as { fx: number; fy: number };
    const toleranceFx = Math.abs(derivatives.fx - correctAnswer.fx) < 0.1;
    const toleranceFy = Math.abs(derivatives.fy - correctAnswer.fy) < 0.1;

    if (toleranceFx && toleranceFy) {
      alert(`¡Correcto!\n∂f/∂x = ${correctAnswer.fx}\n∂f/∂y = ${correctAnswer.fy}\n+${currentProblem.points} puntos`);
      addPoints(currentProblem.points);
    } else {
      alert(`Incorrecto. Revisa tus cálculos.\nTus resultados:\n∂f/∂x ≈ ${formatNumber(derivatives.fx)}\n∂f/∂y ≈ ${formatNumber(derivatives.fy)}`);
    }
  };

  const handleUnlockHint = (hintId: string, cost: number) => {
    if (!unlockedHints.includes(hintId)) {
      setUnlockedHints([...unlockedHints, hintId]);
      addPoints(-cost);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">🔬</div>
        <h1 className="text-4xl font-heading font-bold mb-2">
          Laboratorio de Derivadas
        </h1>
        <p className="text-xl text-gray-600">
          Objetivo 2: Derivadas Parciales y Direccionales
        </p>
      </motion.div>

      {/* Problema Actual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 card bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200"
      >
        <div className="flex items-start space-x-3">
          <span className="text-3xl">📋</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Experimento:</h3>
            <p className="text-gray-700">{currentProblem.statement}</p>
            <div className="mt-3">
              <span className="text-sm font-semibold text-blue-600">
                Recompensa: {currentProblem.points} puntos
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Herramientas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card bg-gradient-to-br from-blue-600 to-green-500 text-white">
            <h2 className="text-2xl font-bold mb-4">🧪 Herramientas</h2>

            {/* Función */}
            <div className="mb-4">
              <label className="block text-xs mb-2">Función f(x,y)</label>
              <input
                type="text"
                value={functionExpr}
                onChange={(e) => setFunctionExpr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
              />
            </div>

            {/* Punto de Evaluación */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">x₀</label>
                <input
                  type="number"
                  value={pointX}
                  onChange={(e) => setPointX(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
                />
              </div>
              <div>
                <label className="block text-xs mb-1">y₀</label>
                <input
                  type="number"
                  value={pointY}
                  onChange={(e) => setPointY(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white"
                />
              </div>
            </div>

            {/* Botones de Corte */}
            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleCut('x')}
                className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedCut === 'x' ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <span>🔪</span>
                <span>Cortar en X (y={pointY})</span>
              </button>
              <button
                onClick={() => handleCut('y')}
                className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedCut === 'y' ? 'bg-white text-blue-600' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <span>🔪</span>
                <span>Cortar en Y (x={pointX})</span>
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCalculateDerivatives}
                className="w-full bg-neon-green hover:bg-green-400 text-gray-900 font-bold py-3 rounded-lg transition-colors"
              >
                🔬 Calcular Derivadas
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={derivatives.fx === null}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                ✅ Verificar
              </button>
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors text-sm"
              >
                💡 {showHints ? 'Ocultar' : 'Mostrar'} Pistas
              </button>
            </div>
          </div>

          {/* Pistas */}
          {showHints && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-4 bg-yellow-50 border-2 border-yellow-200"
            >
              <h3 className="font-bold mb-3">💡 Pistas</h3>
              <div className="space-y-2">
                {currentProblem.hints.map((hint) => (
                  <div key={hint.id} className="bg-white p-3 rounded-lg">
                    {unlockedHints.includes(hint.id) ? (
                      <p className="text-sm text-gray-700">{hint.content}</p>
                    ) : (
                      <button
                        onClick={() => handleUnlockHint(hint.id, hint.cost)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        🔒 Desbloquear ({hint.cost} pts)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Visualización */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card h-[600px]">
            {cutData.length > 0 ? (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold mb-4">
                  📊 Corte en {selectedCut === 'x' ? 'X' : 'Y'}
                </h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cutData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="t"
                        label={{ value: selectedCut === 'x' ? 'x' : 'y', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis label={{ value: 'f(x,y)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={selectedCut === 'x' ? '#3b82f6' : '#10b981'}
                        strokeWidth={3}
                        dot={false}
                        name="f(x,y)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-white rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧫</div>
                  <p className="text-xl font-semibold text-gray-700">Mesa de Trabajo</p>
                  <p className="text-gray-500 mt-2">
                    Selecciona un corte para visualizar la pendiente
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Reporte de Laboratorio */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <div className="card">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <span>📋</span>
            <span>Reporte de Laboratorio</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Derivada Parcial en X</div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                ∂f/∂x = {derivatives.fx !== null ? formatNumber(derivatives.fx) : '_____'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Pendiente cuando y = {pointY}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Derivada Parcial en Y</div>
              <div className="text-2xl font-mono font-bold text-green-600">
                ∂f/∂y = {derivatives.fy !== null ? formatNumber(derivatives.fy) : '_____'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Pendiente cuando x = {pointX}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
