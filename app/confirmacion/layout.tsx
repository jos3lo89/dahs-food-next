import Footer from "../(landing)/components/Footer";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};
export default layout;
