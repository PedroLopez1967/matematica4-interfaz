/**
 * Datos de los 5 objetivos del curso
 */
import type { Objective } from '../types';

export const objectives: Objective[] = [
  {
    id: '1',
    title: 'Límites de Funciones de Dos Variables',
    description: 'Explora límites iterados y existencia de límites en el espacio 3D',
    scenario: 'limit-explorer',
    icon: '🚀',
    color: 'from-blue-900 to-blue-600',
  },
  {
    id: '2',
    title: 'Derivadas Parciales y Direccionales',
    description: 'Analiza superficies mediante derivadas y diferenciabilidad',
    scenario: 'derivative-lab',
    icon: '🔬',
    color: 'from-blue-600 to-green-500',
  },
  {
    id: '3',
    title: 'Optimización con Restricciones',
    description: 'Encuentra extremos usando el método de Lagrange',
    scenario: 'extreme-hunter',
    icon: '🗺️',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: '4',
    title: 'Análisis Vectorial',
    description: 'Navega campos de gradientes y derivadas direccionales',
    scenario: 'gradient-navigator',
    icon: '🧭',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: '5',
    title: 'Campos Vectoriales',
    description: 'Investiga campos conservativos y funciones potenciales',
    scenario: 'field-inspector',
    icon: '🕵️',
    color: 'from-purple-600 to-indigo-500',
  },
];
