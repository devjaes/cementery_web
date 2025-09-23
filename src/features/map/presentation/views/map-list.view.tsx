import ContainerApp from "@/core/layout/container-app";
import { CemeteryMapVisualization } from "../components/cemetery-map.component";

export default function CementeryListView() {
    return (
        <ContainerApp title="Cementerios">
            <h2 className="text-2xl font-bold">Cementerios y nichos</h2>
            <CemeteryMapVisualization />
        </ContainerApp>
    );
}