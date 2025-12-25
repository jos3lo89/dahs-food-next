import SidebarCart from "./SidebarCart";

const Header = () => {
  return (
    <header className="bg-linear-to-r from-pink-100 via-pink-50 to-pink-100 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-default">
            <span className="text-4xl">🌸</span>
            <div>
              <h1 className="text-2xl font-bold text-pink-600">
                Desayunos Dulces
              </h1>
              <p className="text-xs text-pink-400">Hechos con amor</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6">
            <a
              href="#hero"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Inicio
            </a>
            <a
              href="#desayunos"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Desayunos
            </a>
            <a
              href="#extras"
              className="text-pink-600 hover:text-pink-800 font-medium transition"
            >
              Extras
            </a>
          </nav>

          <SidebarCart />
        </div>
      </div>
    </header>
  );
};
export default Header;
