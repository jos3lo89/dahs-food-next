import type { Metadata } from "next";
import Footer from "../(landing)/components/Footer";

export const metadata: Metadata = {
  title: "Rastrear Pedido",
  description:
    "Consulta el estado de tu pedido y revisa el progreso de entrega en Dahs Jhoss.",
};

const layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};
export default layout;
