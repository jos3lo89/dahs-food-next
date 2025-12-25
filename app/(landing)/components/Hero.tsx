const Hero = () => {
  return (
    <section
      id="hero"
      className="bg-linear-to-br from-pink-200 via-pink-100 to-rose-100 py-20 md:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-pink-900 mb-6 leading-tight">
              Los desayunos más{" "}
              <span className="text-pink-600">deliciosos</span> para alegrar tu
              mañana
            </h2>
            <p className="text-xl text-pink-700 mb-8">
              Desayunos preparados con ingredientes frescos y mucho cariño.
              ¡Despierta con sabor!
            </p>
            <a
              href="#desayunos"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Ver Desayunos 🍳
            </a>
          </div>

          <div className="flex-1 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
              <img
                src="/images/hero-breakfast.jpg"
                alt="Desayuno delicioso"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
