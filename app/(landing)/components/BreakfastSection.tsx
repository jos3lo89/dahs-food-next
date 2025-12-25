import prisma from "@/lib/prisma";

const BreakfastSection = async () => {
  const breakFasts = await prisma.product.findMany({
    where: {
      category: {
        slug: "desayunos",
      },
    },
  });

  if (!breakFasts) {
    <div>
      <p>No hay desayunos disponibles en este momento.</p>
    </div>;
  }

  console.log(breakFasts);

  return (
    <section id="desayunos" className="py-20 bg-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-pink-900 mb-4">
            Nuestros Desayunos
          </h2>
          <p className="text-xl text-pink-600">
            Elige tu favorito y comienza el día con energía
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {JSON.stringify(breakFasts)}
        </div>
      </div>
    </section>
  );
};
export default BreakfastSection;
