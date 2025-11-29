/**
 * Escenario 4: Navegante del Gradiente
 * Concepto: Navegación por campos de temperatura
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, ResponsiveContainer } from 'recharts';
import { gradient, directionalDerivative, normalizeVector, evaluateFunction, formatNumber, generateContourLines } from '../../utils/mathUtils';
import { getProblemsByObjective } from '../../data/problems';
import { useProgressStore } from '../../store/progressStore';

export default function GradientNavigator() {
  const [functionExpr, setFunctionExpr] = useState('x^2 + y^2');
  const [pointX, setPointX] = useState(3);
  const [pointY, setPointY] = useState(4);
  const [dirX, setDirX] = useState(1);
  const [dirY, setDirY] = useState(1);
  const [gradResult, setGradResult] = useState<{ x: number; y: number } | null>(null);
  const [dirDerivative, setDirDerivative] = useState<number | null>(null);
  const [contourData, setContourData] = useState<Array<{ x: number; y: number; z: number }>>([]);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);

  const { addPoints } = useProgressStore();
  const problems = getProblemsByObjective('4');
  const currentProblem = problems[0];

  const handleCalculateGradient = () => {
    const point = { x: pointX, y: pointY };
    const grad = gradient(functionExpr, point);
    setGradResult(grad);

    // Generar datos de contorno
    const levels = [10, 20, 30, 40, 50];
    const contours = generateContourLines(functionExpr, levels, [-10, 10], [-10, 10], 30);
    const data: Array<{ x: number; y: number; z: number }> = [];

    contours.forEach(contour => {
      contour.points.forEach(p => {
        data.push({ x: p.x, y: p.y, z: contour.level });
      });
    });

    // Agregar el punto actual
    data.push({ x: pointX, y: pointY, z: evaluateFunction(functionExpr, point) });

    setContourData(data);
  };

  const handleCalculateDirectional = () => {
    if (!gradResult) {
      alert('Primero calcula el gradiente.');
      return;
    }

    const point = { x: pointX, y: pointY };
    const direction = normalizeVector({ x: dirX, y: dirY });
    const dirDeriv = directionalDerivative(functionExpr, point, direction);
    setDirDerivative(dirDeriv);
  };

  const handleCheckAnswer = () => {
    if (!gradResult) {
      alert('Primero calcula el gradiente.');
      return;
    }

    const correctAnswer = currentProblem.correctAnswer as { x: number; y: number };
    const tolX = Math.abs(gradResult.x - correctAnswer.x) < 0.5;
    const tolY = Math.abs(gradResult.y - correctAnswer.y) < 0.5;

    if (tolX && tolY) {
      alert(`¡Correcto! El gradiente es (${correctAnswer.x}, ${correctAnswer.y})\n+${currentProblem.points} puntos`);
      addPoints(currentProblem.points);
    } else {
      alert(`Incorrecto. Tu resultado: (${formatNumber(gradResult.x)}, ${formatNumber(gradResult.y)})`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-4xl font-heading font-bold mb-2">Navegante del Gradiente</h1>
        <p className="text-xl text-gray-600">Objetivo 4: Análisis Vectorial</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full">
          <span>🔥</span>
          <span className="font-bold">Temperatura: {gradResult ? formatNumber(evaluateFunction(functionExpr, { x: pointX, y: pointY })) : '---'}°C</span>
        </div>
      </motion.div>

      {/* Problema */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 card bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">🎯</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Misión:</h3>
            <p className="text-gray-700">{currentProblem.statement}</p>
            <div className="mt-3">
              <span className="text-sm font-semibold text-red-600">Recompensa: {currentProblem.points} puntos</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controles */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="card bg-gradient-to-br from-red-500 to-pink-500 text-white">
            <h2 className="text-2xl font-bold mb-4">🎮 Controles</h2>

            <div className="mb-4">
              <label className="block text-xs mb-2">Campo de Temperatura T(x,y)</label>
              <input type="text" value={functionExpr} onChange={(e) => setFunctionExpr(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">x</label>
                <input type="number" value={pointX} onChange={(e) => setPointX(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
              <div>
                <label className="block text-xs mb-1">y</label>
                <input type="number" value={pointY} onChange={(e) => setPointY(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-2">Dirección de Movimiento</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={dirX} onChange={(e) => setDirX(Number(e.target.value))} placeholder="dx" className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
                <input type="number" value={dirY} onChange={(e) => setDirY(Number(e.target.value))} placeholder="dy" className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <button onClick={handleCalculateGradient} className="w-full bg-neon-green hover:bg-green-400 text-gray-900 font-bold py-3 rounded-lg">📍 Calcular ∇T</button>
              <button onClick={handleCalculateDirectional} disabled={!gradResult} className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold py-3 rounded-lg disabled:opacity-50">🚀 Derivada Direccional</button>
              <button onClick={handleCheckAnswer} disabled={!gradResult} className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg disabled:opacity-50">✅ Verificar</button>
              <button onClick={() => setShowHints(!showHints)} className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm">💡 {showHints ? 'Ocultar' : 'Mostrar'} Pistas</button>
            </div>
          </div>

          {showHints && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mt-4 bg-yellow-50 border-2 border-yellow-200">
              <h3 className="font-bold mb-3">💡 Pistas</h3>
              <div className="space-y-2">
                {currentProblem.hints.map((hint) => (
                  <div key={hint.id} className="bg-white p-3 rounded-lg">
                    {unlockedHints.includes(hint.id) ? (
                      <p className="text-sm text-gray-700">{hint.content}</p>
                    ) : (
                      <button onClick={() => { setUnlockedHints([...unlockedHints, hint.id]); addPoints(-hint.cost); }} className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
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
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
          <div className="card h-[600px]">
            {contourData.length > 0 ? (
              <div className="h-full flex flex-col">
                <h3 className="text-lg font-bold mb-2">🌡️ Mapa de Temperatura</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="x" />
                      <YAxis type="number" dataKey="y" name="y" />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Curvas de Nivel" data={contourData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-red-900 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌡️</div>
                  <p className="text-xl font-semibold">Mapa de Temperatura</p>
                  <p className="text-gray-300 mt-2">Calcula el gradiente para ver el campo</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Panel de Información */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">📊 Panel de Información</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Gradiente</div>
              <div className="text-xl font-mono font-bold text-green-700">
                ∇T = ({gradResult ? formatNumber(gradResult.x) : '__'}, {gradResult ? formatNumber(gradResult.y) : '__'})
              </div>
              <div className="text-xs text-gray-500 mt-1">Dirección de máximo crecimiento</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Derivada Direccional</div>
              <div className="text-xl font-mono font-bold text-blue-700">
                D_u T = {dirDerivative !== null ? formatNumber(dirDerivative) : '__'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Tasa de cambio en dirección ({dirX}, {dirY})</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
