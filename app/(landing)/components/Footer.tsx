const Footer = () => {
  return (
    <footer className="bg-linear-to-r from-pink-200 to-pink-300 py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-6">
          <span className="text-5xl">🌸</span>
          <h3 className="text-3xl font-bold mt-3">Desayunos Dulces</h3>
        </div>

        <p className="text-xl mb-6 text-pink-500">
          Desayunos hechos con amor ❤️
        </p>

        <div className="flex justify-center space-x-8 mb-6">
          <a href="#" className="transition" target="_blank"></a>
          <a href="#" target="_blank"></a>
          <a href="#" className="transition" target="_blank"></a>
        </div>

        <p className="text-pink-700 text-sm">
          © 2026 Casi todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
