import { Metadata } from "next";
import BreakfastSection from "./components/BreakfastSection";
import ExtrasSection from "./components/ExtrasSection";
import FeaturedProducts from "./components/FeaturedProducts";
import Hero from "./components/Hero";
import PromotionsSection from "./components/PromotionsSection";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Desayunos artesanales, packs y postres con delivery rápido en Andahuaylas. Pide en línea y sorprende hoy.",
};

const LandingPage = () => {
  return (
    <>
      <Hero />
      <PromotionsSection />
      <FeaturedProducts />
      <BreakfastSection />
      <ExtrasSection />
    </>
  );
};

export default LandingPage;
