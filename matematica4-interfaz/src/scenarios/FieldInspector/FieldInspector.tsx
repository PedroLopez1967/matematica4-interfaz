/**
 * Escenario 5: Inspector de Campos Vectoriales
 * Concepto: Detective investigando campos conservativos
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { isConservative2D, formatNumber } from '../../utils/mathUtils';
import { getProblemsByObjective } from '../../data/problems';
import { useProgressStore } from '../../store/progressStore';

export default function FieldInspector() {
  const [componentP, setComponentP] = useState('2*x');
  const [componentQ, setComponentQ] = useState('2*y');
  const [analysisResult, setAnalysisResult] = useState<{
    conservative: boolean;
    dPdy: number[];
    dQdx: number[];
    matches: boolean[];
  } | null>(null);
  const [verdict, setVerdict] = useState<'conservative' | 'not-conservative' | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [unlockedHints, setUnlockedHints] = useState<string[]>([]);

  const { addPoints } = useProgressStore();
  const problems = getProblemsByObjective('5');
  const currentProblem = problems[0];

  const handleAnalyze = () => {
    const result = isConservative2D(componentP, componentQ);
    setAnalysisResult(result);
    setVerdict(null);
  };

  const handleEmitVerdict = (verdictChoice: 'conservative' | 'not-conservative') => {
    setVerdict(verdictChoice);
  };

  const handleCheckAnswer = () => {
    if (!analysisResult || !verdict) {
      alert('Primero analiza el campo y emite un veredicto.');
      return;
    }

    const correctAnswer = currentProblem.correctAnswer as { conservative: boolean };
    const userAnswerCorrect = (verdict === 'conservative' && correctAnswer.conservative) ||
                              (verdict === 'not-conservative' && !correctAnswer.conservative);

    if (userAnswerCorrect) {
      alert(`¡Correcto! El campo ${correctAnswer.conservative ? 'ES' : 'NO ES'} conservativo.\n+${currentProblem.points} puntos`);
      addPoints(currentProblem.points);
    } else {
      alert(`Incorrecto. Revisa las condiciones: ∂P/∂y debe ser igual a ∂Q/∂x.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="text-6xl mb-4">🕵️</div>
        <h1 className="text-4xl font-heading font-bold mb-2">Inspector de Campos Vectoriales</h1>
        <p className="text-xl text-gray-600">Objetivo 5: Campos Vectoriales y Funciones Potenciales</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
          <span>📋</span>
          <span className="font-bold">Caso #5</span>
        </div>
      </motion.div>

      {/* Problema */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 card bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
        <div className="flex items-start space-x-3">
          <span className="text-3xl">🔍</span>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">Caso de Investigación:</h3>
            <p className="text-gray-700">{currentProblem.statement}</p>
            <div className="mt-3">
              <span className="text-sm font-semibold text-purple-600">Recompensa: {currentProblem.points} puntos</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kit Forense */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="card bg-gradient-to-br from-purple-600 to-indigo-500 text-white">
            <h2 className="text-2xl font-bold mb-4">🔍 Kit Forense</h2>

            <div className="mb-4">
              <label className="block text-xs mb-2">Campo Vectorial F⃗ = (P, Q)</label>
              <div className="space-y-2">
                <input type="text" value={componentP} onChange={(e) => setComponentP(e.target.value)} placeholder="P(x,y)" className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
                <input type="text" value={componentQ} onChange={(e) => setComponentQ(e.target.value)} placeholder="Q(x,y)" className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white" />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <button onClick={handleAnalyze} className="w-full bg-white/30 hover:bg-white/40 px-4 py-3 rounded-lg transition-colors flex items-center space-x-2">
                <span>🔍</span>
                <span>Analizar Campo</span>
              </button>
              <button
                onClick={() => handleEmitVerdict('conservative')}
                disabled={!analysisResult}
                className="w-full bg-green-500 hover:bg-green-400 px-4 py-3 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <span>✅</span>
                <span>Es Conservativo</span>
              </button>
              <button
                onClick={() => handleEmitVerdict('not-conservative')}
                disabled={!analysisResult}
                className="w-full bg-red-500 hover:bg-red-400 px-4 py-3 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <span>❌</span>
                <span>No es Conservativo</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/30">
              <button onClick={handleCheckAnswer} disabled={!verdict} className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2">
                <span>⚖️</span>
                <span>Verificar Veredicto</span>
              </button>
            </div>

            <button onClick={() => setShowHints(!showHints)} className="w-full mt-2 bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors text-sm">
              💡 {showHints ? 'Ocultar' : 'Mostrar'} Pistas
            </button>
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
            {analysisResult ? (
              <div className="h-full flex flex-col justify-center">
                <h3 className="text-lg font-bold mb-4">📊 Resultado del Análisis</h3>

                <div className={`p-8 rounded-lg mb-6 ${analysisResult.conservative ? 'bg-green-100 border-2 border-green-300' : 'bg-red-100 border-2 border-red-300'}`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{analysisResult.conservative ? '✅' : '❌'}</div>
                    <div className="text-2xl font-bold mb-2">
                      {analysisResult.conservative ? 'Campo CONSERVATIVO' : 'Campo NO CONSERVATIVO'}
                    </div>
                    <div className="text-sm text-gray-700 mt-4">
                      {analysisResult.conservative
                        ? 'Existe función potencial f tal que F⃗ = ∇f'
                        : 'No existe función potencial'}
                    </div>
                  </div>
                </div>

                {verdict && (
                  <div className={`p-4 rounded-lg ${verdict === 'conservative' ? 'bg-blue-50 border-2 border-blue-300' : 'bg-orange-50 border-2 border-orange-300'}`}>
                    <div className="text-center">
                      <div className="font-bold">Tu Veredicto:</div>
                      <div className="text-lg">{verdict === 'conservative' ? 'CONSERVATIVO' : 'NO CONSERVATIVO'}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🌊</div>
                  <p className="text-xl font-semibold">Campo Vectorial Sospechoso</p>
                  <p className="text-gray-300 mt-2">Analiza el campo para comenzar la investigación</p>
                  <div className="mt-6">
                    <p className="text-cyan-400 text-lg font-mono">F⃗ = (P, Q)</p>
                    <p className="text-sm text-gray-400 mt-2">¿Es conservativo?</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tabla de Evidencias */}
      {analysisResult && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">📊 Tabla de Evidencias</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Punto de Prueba</th>
                    <th className="px-4 py-2 text-left">∂P/∂y</th>
                    <th className="px-4 py-2 text-left">∂Q/∂x</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {analysisResult.dPdy.map((dPdy, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono">Punto {idx + 1}</td>
                      <td className="px-4 py-2 font-mono">{formatNumber(dPdy)}</td>
                      <td className="px-4 py-2 font-mono">{formatNumber(analysisResult.dQdx[idx])}</td>
                      <td className="px-4 py-2">
                        {analysisResult.matches[idx] ? (
                          <span className="text-green-600 font-semibold">✓ Iguales</span>
                        ) : (
                          <span className="text-red-600 font-semibold">✗ Diferentes</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="font-bold mb-2">Criterio de Conservatividad:</div>
              <div className="text-sm text-gray-700">
                Un campo F⃗ = (P, Q) es conservativo si y solo si ∂P/∂y = ∂Q/∂x en todo punto del dominio.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
