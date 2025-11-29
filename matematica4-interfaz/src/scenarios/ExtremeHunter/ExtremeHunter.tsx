/**
 * Escenario 3: Cazador de Extremos
 * Concepto: Búsqueda del tesoro con Lagrange
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { gradient, evaluateFunction, formatNumber } from '../../utils/mathUtils';
import { getProblemsByObjective } from '../../data/problems';
import { useProgressStore } from '../../store/progressStore';

export default function ExtremeHunter() {
  const [objectiveFunc, setObjectiveFunc] = useState('x * y');
  const [constraintFunc, setConstraintFunc] = useState('x + y - 10');
  const [candidateX, setCandidateX] = useState(5);
  const [candidateY, setCandidateY] = useState(5);
  const [lambda, setLambda] = useState(1);
  const [result, setResult] = useState<{
    gradF: { x: number; y: number };
    gradG: { x: number; y: number };
    value: number;
    satisfied: boolean;
  } | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);

  const { addPoints } = useProgressStore();
  const problems = getProblemsByObjective('3');
  const currentProblem = problems[0];

  const handleAnalyze = () => {
    const point = { x: candidateX, y: candidateY };
    const gradF = gradient(objectiveFunc, point);
    const gradG = gradient(constraintFunc, point);
    const value = evaluateFunction(objectiveFunc, point);

    // Verificar si ∇f ≈ λ∇g
    const diff = Math.abs(gradF.x - lambda * gradG.x) + Math.abs(gradF.y - lambda * gradG.y);
    const satisfied = diff < 0.1;

    setResult({ gradF, gradG, value, satisfied });
  };

  const handleCheckAnswer = () => {
    if (!result) {
      alert('Primero analiza el punto candidato.');
      return;
    }

    const correctAnswer = currentProblem.correctAnswer as { x: number; y: number; value: number };
    const tolX = Math.abs(candidateX - correctAnswer.x) < 0.5;
    const tolY = Math.abs(candidateY - correctAnswer.y) < 0.5;

    if (tolX && tolY && result.satisfied) {
      alert(`¡Correcto! Encontraste el extremo en (${correctAnswer.x}, ${correctAnswer.y})\nValor: ${correctAnswer.value}\n+${currentProblem.points} puntos`);
      addPoints(currentProblem.points);
    } else {
      alert(`Incorrecto. El punto debe satisfacer ∇f = λ∇g y la restricción g=0.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-4xl font-heading font-bold mb-2">Cazador de Extremos</h1>
        <p className="text-xl text-gray-600">Objetivo 3: Optimización con Restricciones</p>
      </motion.div>

      {/* Problema */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">🏴‍☠️</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Misión del Tesoro:</h3>
            <p className="text-gray-700">{currentProblem.statement}</p>
            <div className="mt-3">
              <span className="text-sm font-semibold text-yellow-600">Recompensa: {currentProblem.points} puntos</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel de Control */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <h2 className="text-2xl font-bold mb-4">🎒 Equipamiento</h2>

            <div className="mb-4">
              <label className="block text-xs mb-2">Función Objetivo f(x,y)</label>
              <input type="text" value={objectiveFunc} onChange={(e) => setObjectiveFunc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-2">Restricción g(x,y) = 0</label>
              <input type="text" value={constraintFunc} onChange={(e) => setConstraintFunc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">x</label>
                <input type="number" value={candidateX} onChange={(e) => setCandidateX(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
              <div>
                <label className="block text-xs mb-1">y</label>
                <input type="number" value={candidateY} onChange={(e) => setCandidateY(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs mb-1">λ (multiplicador)</label>
              <input type="number" step="0.1" value={lambda} onChange={(e) => setLambda(Number(e.target.value))} className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
            </div>

            <div className="space-y-2">
              <button onClick={handleAnalyze} className="w-full bg-neon-green hover:bg-green-400 text-gray-900 font-bold py-3 rounded-lg">🧭 Analizar Punto</button>
              <button onClick={handleCheckAnswer} disabled={!result} className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg disabled:opacity-50">✅ Verificar</button>
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
            {result ? (
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-4">📊 Análisis del Punto ({candidateX}, {candidateY})</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">∇f (Gradiente de f)</div>
                    <div className="text-xl font-mono font-bold text-blue-600">({formatNumber(result.gradF.x)}, {formatNumber(result.gradF.y)})</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">λ∇g (λ × Gradiente de g)</div>
                    <div className="text-xl font-mono font-bold text-green-600">({formatNumber(lambda * result.gradG.x)}, {formatNumber(lambda * result.gradG.y)})</div>
                  </div>
                </div>

                <div className={`p-6 rounded-lg ${result.satisfied ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{result.satisfied ? '✅' : '❌'}</div>
                    <div className="font-bold text-lg mb-2">{result.satisfied ? 'Condición de Lagrange Satisfecha' : 'No satisface la condición'}</div>
                    <div className="text-sm text-gray-700">Valor de f: <span className="font-mono font-bold">{formatNumber(result.value)}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-xl font-semibold text-gray-700">Mapa del Territorio</p>
                  <p className="text-gray-500 mt-2">Analiza un punto candidato para buscar el tesoro</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sistema de Ecuaciones */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
        <div className="card">
          <h3 className="text-lg font-bold mb-4">🎯 Sistema de Ecuaciones de Lagrange</h3>
          <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm space-y-2">
            <div>∇f = λ∇g</div>
            <div>g(x,y) = 0</div>
            {result && (
              <div className="mt-4 text-gray-700">
                <div>∂f/∂x = λ∂g/∂x → {formatNumber(result.gradF.x)} ≈ λ×{formatNumber(result.gradG.x)}</div>
                <div>∂f/∂y = λ∂g/∂y → {formatNumber(result.gradF.y)} ≈ λ×{formatNumber(result.gradG.y)}</div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
