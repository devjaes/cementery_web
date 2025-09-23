export function StatusChip({ estado }: { estado: string }) {
  let color = "bg-gray-200 text-gray-700";
  if (estado.toLowerCase() === "disponible") color = "bg-green-100 text-green-700";
  if (estado.toLowerCase() === "ocupado") color = "bg-red-100 text-red-700";
  if (estado.toLowerCase() === "reservado") color = "bg-yellow-100 text-yellow-700";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{estado}</span>
  );
}
  