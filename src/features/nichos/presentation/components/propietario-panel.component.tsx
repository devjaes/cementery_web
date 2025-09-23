import { NichoPropietarioForm } from "../../../propietarios-nichos/presentation/components/nicho-propietario-form.component";

interface PropietarioPanelProps {
  nichoId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PropietarioPanel({ nichoId, isOpen, onClose, onSuccess }: PropietarioPanelProps) {
  return (
    <aside
      className={
        "fixed top-0 right-0 h-full w-[700px] bg-white shadow-lg z-50 border-l border-gray-200 transition-transform duration-300 " +
        (isOpen ? "translate-x-0" : "translate-x-full")
      }
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Agregar Nuevo Propietario</h2>
        <button
          className="text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        <NichoPropietarioForm nichoId={nichoId} onSuccess={onSuccess} />
      </div>
    </aside>
  );
} 