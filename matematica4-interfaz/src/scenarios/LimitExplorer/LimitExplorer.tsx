/**
 * Escenario 1: Explorador de Límites
 * Concepto: Astronauta explorando límites por diferentes caminos
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateLimit, formatNumber } from '../../utils/mathUtils';
import { getProblemsByObjective } from '../../data/problems';
import { useProgressStore } from '../../store/progressStore';

type PathType = 'x' | 'y' | 'diagonal' | 'parabolic';

export default function LimitExplorer() {
  const [functionExpr, setFunctionExpr] = useState('(x^2 - y^2) / (x - y)');
  const [selectedPath, setSelectedPath] = useState<PathType>('x');
  const [limitResult, setLimitResult] = useState<{
    values: Array<{ t: number; value: number }>;
    limit: number | null;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);

  const { addPoints } = useProgressStore();
  const problems = getProblemsByObjective('1');
  const currentProblem = problems[0];

  const pathColors = {
    x: '#ef4444',
    y: '#3b82f6',
    diagonal: '#10b981',
    parabolic: '#f59e0b',
  };

  const pathNames = {
    x: 'Eje X (y=0)',
    y: 'Eje Y (x=0)',
    diagonal: 'Diagonal (y=x)',
    parabolic: 'Parabólica (y=x²)',
  };

  const handleCalculateLimit = () => {
    try {
      const result = calculateLimit(functionExpr, 'x', 0, selectedPath);
      setLimitResult(result);
    } catch (error) {
      console.error('Error calculating limit:', error);
      alert('Error al calcular el límite. Verifica la expresión de la función.');
    }
  };

  const handleUnlockHint = (hintId: string, cost: number) => {
    if (!unlockedHints.includes(hintId)) {
      setUnlockedHints([...unlockedHints, hintId]);
      addPoints(-cost);
    }
  };

  const handleCheckAnswer = () => {
    if (limitResult && limitResult.limit !== null) {
      const userAnswer = limitResult.limit;
      const correctAnswer = currentProblem.correctAnswer as number;
      const tolerance = 0.01;

      if (Math.abs(userAnswer - correctAnswer) < tolerance) {
        alert(`¡Correcto! El límite es ${formatNumber(correctAnswer)}\n+${currentProblem.points} puntos`);
        addPoints(currentProblem.points);
      } else {
        alert(`Incorrecto. El límite que calculaste es ${formatNumber(userAnswer)}, pero verifica tu resultado.`);
      }
    } else {
      alert('Primero calcula el límite seleccionando un camino.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-4xl font-heading font-bold mb-2">
          Explorador de Límites
        </h1>
        <p className="text-xl text-gray-600">
          Objetivo 1: Límites y Continuidad de Funciones Multivariables
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <span>📍</span>
          <span className="font-bold">Coordenadas: (0, 0)</span>
        </div>
      </motion.div>

      {/* Problema Actual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200"
      >
        <div className="flex items-start space-x-3">
          <span className="text-3xl">📋</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Misión Actual:</h3>
            <p className="text-gray-700">{currentProblem.statement}</p>
            <div className="mt-3 flex items-center space-x-4">
              <span className="text-sm font-semibold text-purple-600">
                Recompensa: {currentProblem.points} puntos
              </span>
              <span className="text-sm px-3 py-1 bg-purple-200 text-purple-800 rounded-full">
                {currentProblem.difficulty === 'beginner' ? 'Principiante' :
                 currentProblem.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel de Control */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card bg-gradient-to-br from-space-blue to-blue-600 text-white">
            <h2 className="text-2xl font-bold mb-4">🎛️ Panel de Control</h2>

            {/* Función */}
            <div className="mb-4">
              <label className="block text-xs mb-2">Función a explorar</label>
              <input
                type="text"
                value={functionExpr}
                onChange={(e) => setFunctionExpr(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60"
                placeholder="(x^2 - y^2) / (x - y)"
              />
              <p className="text-xs mt-1 text-white/70">
                Usa ^, *, /, +, -, sin, cos, etc.
              </p>
            </div>

            {/* Selección de Camino */}
            <div className="mb-4">
              <label className="block text-xs mb-2">Camino de Aproximación</label>
              <div className="space-y-2">
                {(Object.keys(pathNames) as PathType[]).map((path) => (
                  <button
                    key={path}
                    onClick={() => setSelectedPath(path)}
                    className={`w-full px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                      selectedPath === path
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <span>{pathNames[path]}</span>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: pathColors[path] }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="space-y-2">
              <button
                onClick={handleCalculateLimit}
                className="w-full bg-neon-green hover:bg-green-400 text-gray-900 font-bold py-3 rounded-lg transition-colors"
              >
                🔍 Calcular Límite
              </button>
              <button
                onClick={handleCheckAnswer}
                disabled={!limitResult}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Verificar Respuesta
              </button>
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors text-sm"
              >
                💡 {showHints ? 'Ocultar' : 'Mostrar'} Pistas
              </button>
            </div>
          </div>

          {/* Sistema de Pistas */}
          {showHints && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mt-4 bg-yellow-50 border-2 border-yellow-200"
            >
              <h3 className="font-bold mb-3 flex items-center space-x-2">
                <span>💡</span>
                <span>Pistas Disponibles</span>
              </h3>
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
                        🔒 Desbloquear pista ({hint.cost} puntos)
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
            {limitResult && limitResult.values.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">
                    📊 Aproximación por {pathNames[selectedPath]}
                  </h3>
                  {limitResult.limit !== null ? (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Límite estimado:</p>
                      <p className="text-3xl font-bold text-green-600">
                        {formatNumber(limitResult.limit)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-red-600 font-semibold">
                        El límite no existe o es infinito
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={limitResult.values}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="t"
                        label={{ value: 'Distancia al origen', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis label={{ value: 'f(x,y)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={pathColors[selectedPath]}
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        name="Valor de f(x,y)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌌</div>
                  <p className="text-xl font-semibold">Espacio sin Explorar</p>
                  <p className="text-gray-300 mt-2">
                    Selecciona un camino y calcula el límite para ver la aproximación
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tabla de Valores */}
      {limitResult && limitResult.values.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="card">
            <h3 className="text-lg font-bold mb-4">📋 Tabla de Aproximación</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Paso</th>
                    <th className="px-4 py-2 text-left">Distancia</th>
                    <th className="px-4 py-2 text-left">Valor f(x,y)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {limitResult.values.slice(-10).map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono">{limitResult.values.length - 10 + idx + 1}</td>
                      <td className="px-4 py-2 font-mono">{formatNumber(item.t)}</td>
                      <td className="px-4 py-2 font-mono font-bold" style={{ color: pathColors[selectedPath] }}>
                        {formatNumber(item.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
