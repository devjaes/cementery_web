export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100/60 to-white px-4">
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-4 text-center drop-shadow-sm">
          Sistema de Cementerios Municipales
        </h1>
        <h2 className="text-2xl md:text-3xl text-green-700 font-semibold mb-4 text-center">
          Bienvenido al portal institucional
        </h2>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-10">
          Acceda a la gestión moderna y centralizada de nichos, huecos, propietarios, inhumaciones y más. Plataforma oficial para la administración eficiente de cementerios municipales.
        </p>
        <a
          href="/sign-in"
          className="inline-block px-10 py-4 rounded-xl bg-green-600 text-white text-xl font-bold shadow-lg hover:bg-green-700 transition-colors mb-8"
        >
          Ingresar al sistema
        </a>
      </main>
      <footer className="w-full text-center text-gray-400 text-sm py-4 mt-auto">
        © {new Date().getFullYear()} Municipio de Píllaro. Todos los derechos reservados.
      </footer>
    </div>
  );
}
