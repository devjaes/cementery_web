import { SiteHeader } from "./site-header";

type ContainerAppProps = {
  children: React.ReactNode;
  title: string;
};

export default function ContainerApp({ children, title }: ContainerAppProps) {
  return (
    <>
      <SiteHeader title={title} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2 p-4">
          {children}
        </div>
      </div>
    </>
  );
}
