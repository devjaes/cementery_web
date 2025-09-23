// utils/hueco-color.ts
export function getColorByHuecoOcupado(ocupados: number, reservados: number, total: number) {
  const usados = ocupados + reservados;
  const ratio = total > 0 ? usados / total : 0;

  if (usados === 0)
    return {
      color: 'bg-green-400',
      hover: 'hover:bg-green-500',
      // label: 'Disponible (0/0 ocupados o reservados)'
    };

  if (usados === total)
    return {
      color: 'bg-red-600',
      hover: 'hover:bg-red-700',
      // label: 'Lleno (100%)'
    };

  if (reservados > 0 && ocupados === 0)
    return {
      color: 'bg-blue-400',
      hover: 'hover:bg-blue-500',
      label: `Reservado (${reservados}/${total})`
    };

  if (ratio <= 0.2)
    return {
      color: 'bg-lime-400',
      hover: 'hover:bg-lime-500',
      // label: `Bajo (${ocupados + reservados}/${total})`
    };

  if (ratio <= 0.4)
    return {
      color: 'bg-yellow-400',
      hover: 'hover:bg-yellow-500',
      // label: `Moderado (${ocupados + reservados}/${total})`
    };

  if (ratio <= 0.6)
    return {
      color: 'bg-amber-500',
      hover: 'hover:bg-amber-600',
      // label: `Medio (${ocupados + reservados}/${total})`
    };

  if (ratio <= 0.8)
    return {
      color: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      // label: `Alto (${ocupados + reservados}/${total})`
    };

  return {
    color: 'bg-red-500',
    hover: 'hover:bg-red-600',
    // label: `Muy alto (${ocupados + reservados}/${total})`
  };
}
