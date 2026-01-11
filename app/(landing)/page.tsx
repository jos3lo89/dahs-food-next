import BreakfastSection from "./components/BreakfastSection";
import ExtrasSection from "./components/ExtrasSection";
import FeaturedProducts from "./components/FeaturedProducts";
import Hero from "./components/Hero";
import PromotionsSection from "./components/PromotionsSection";

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
