export type EstadoNicho = 'Vendido' | 'Reservado' | 'Disponible';

export function getColorByEstadoNicho(estado: EstadoNicho) {
  switch (estado) {
    case 'Vendido':
      return {
        color: 'bg-red-500',
        hover: 'hover:bg-red-600',
        label: 'Vendido'
      };
    case 'Reservado':
      return {
        color: 'bg-yellow-400',
        hover: 'hover:bg-yellow-500',
        label: 'Reservado'
      };
    case 'Disponible':
      return {
        color: 'bg-green-400',
        hover: 'hover:bg-green-500',
        label: 'Disponible'
      };
    default:
      return {
        color: 'bg-gray-400',
        hover: 'hover:bg-gray-500',
        label: 'Estado desconocido'
      };
  }
}
