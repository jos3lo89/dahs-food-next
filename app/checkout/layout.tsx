import type { Metadata } from "next";
import Footer from "../(landing)/components/Footer";

export const metadata: Metadata = {
  title: "Finalizar Pedido",
  description:
    "Completa tus datos, sube tu comprobante Yape y confirma tu pedido en Dahs Jhoss.",
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
