/**
 * Dashboard - Página de inicio con selección de objetivos
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { objectives } from '../data/objectives';
import { useProgressStore } from '../store/progressStore';

export default function Dashboard() {
  const { completedObjectives, scenarioProgress, totalPoints } = useProgressStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Calcular estadísticas
  const completedCount = completedObjectives.length;
  const totalObjectives = objectives.length;
  const overallProgress = Math.round((completedCount / totalObjectives) * 100);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-heading font-bold mb-4">
          <span className="text-gradient">Matemática IV</span>
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Explora conceptos de cálculo multivariable de forma interactiva
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="card">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-primary">{completedCount}/{totalObjectives}</div>
            <div className="text-sm text-gray-600">Objetivos Completados</div>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-500">{totalPoints}</div>
            <div className="text-sm text-gray-600">Puntos Totales</div>
          </div>
          <div className="card">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-green-500">{overallProgress}%</div>
            <div className="text-sm text-gray-600">Progreso General</div>
          </div>
        </div>
      </motion.div>

      {/* Objetivos/Escenarios */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {objectives.map((objective) => {
          const isCompleted = completedObjectives.includes(objective.id);
          const progress = scenarioProgress[objective.scenario] || 0;

          return (
            <motion.div key={objective.id} variants={item}>
              <Link to={`/${objective.scenario.replace('-', '')}`}>
                <div className="card hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                  {/* Header con gradiente */}
                  <div
                    className={`bg-gradient-to-r ${objective.color} text-white p-6 rounded-t-xl -m-6 mb-4`}
                  >
                    <div className="text-4xl mb-2">{objective.icon}</div>
                    <h3 className="text-xl font-heading font-bold">
                      Objetivo {objective.id}
                    </h3>
                  </div>

                  {/* Contenido */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">{objective.title}</h4>
                    <p className="text-gray-600 text-sm">{objective.description}</p>

                    {/* Progreso */}
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${objective.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    {isCompleted && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <span className="text-xl">✓</span>
                        <span className="font-medium">Completado</span>
                      </div>
                    )}

                    {/* Call to Action */}
                    <button className="w-full btn-primary group-hover:scale-105 transition-transform">
                      {isCompleted ? 'Repasar' : 'Comenzar'}
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 card max-w-4xl mx-auto"
      >
        <h3 className="text-2xl font-heading font-bold mb-4">
          🎮 Cómo Usar la Plataforma
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">1.</span>
              <span>Selecciona un objetivo para comenzar</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">2.</span>
              <span>Resuelve problemas interactivos</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">3.</span>
              <span>Usa las visualizaciones 3D para entender mejor</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">4.</span>
              <span>Usa pistas si necesitas ayuda</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">5.</span>
              <span>Gana puntos y desbloquea logros</span>
            </p>
            <p className="flex items-start space-x-2">
              <span className="text-primary font-bold">6.</span>
              <span>Tu progreso se guarda automáticamente</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
