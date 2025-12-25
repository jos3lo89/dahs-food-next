import Footer from "./components/Footer";
import Header from "./components/Header";

const LandingLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export default LandingLayout;
