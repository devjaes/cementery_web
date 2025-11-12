import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4">
      <main className="flex flex-col items-center justify-center text-center space-y-6 max-w-md w-full">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Sistema de Cementerios Municipales
          </h1>
          <p className="text-muted-foreground">
            Municipio de Píllaro
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Gestión de nichos, propietarios y más
        </p>

        <div className="pt-4 w-full">
          <Button asChild size="lg" className="w-full">
            <Link href="/sign-in">Ingresar</Link>
          </Button>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full text-center text-xs text-muted-foreground py-4">
        © {new Date().getFullYear()} Municipio de Píllaro
      </footer>
    </div>
  );
}
