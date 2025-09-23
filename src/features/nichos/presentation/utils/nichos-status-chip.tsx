export function StatusChip({ estado }: { estado: string }) {
    let color = "bg-gray-200 text-gray-700";
    if (estado.toLowerCase() === "activo") color = "bg-green-100 text-green-700";
    if (estado.toLowerCase() === "inactivo") color = "bg-gray-300 text-gray-500";
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{estado}</span>
    );
}