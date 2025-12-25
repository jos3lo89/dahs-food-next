import { ProductsI } from "@/types/products";

type Props = {
  product: ProductsI;
};

const Card = ({ product }: Props) => {
  return (
    <div
      id="cart-modal"
      className="fixed inset-0 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-linear-to-r from-pink-500 to-pink-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl" aria-hidden="true">
              🛒
            </span>
            <h3 className="text-2xl font-bold">Tu Carrito</h3>

            <span
              className={`ml-2 text-sm px-2 py-1 rounded-full bg-white/20 ${
                [].length > 0 ? "inline-flex" : "hidden"
              }`}
              aria-label={`Productos en carrito: ${[].length}`}
            >
              {[].length}
            </span>
          </div>

          <button
            id="close-cart"
            className="text-white hover:text-pink-200 text-3xl font-bold"
            aria-label="Cerrar carrito"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {[].length === 0 ? (
            <div id="empty-cart-message" className="text-center py-12">
              <span className="text-6xl mb-4 block" aria-hidden="true">
                🍽️
              </span>
              <p className="text-xl text-gray-500">Tu carrito está vacío</p>
              <p className="text-gray-400 mt-2">
                ¡Agrega algunos desayunos deliciosos!
              </p>
            </div>
          ) : (
            <div id="cart-items" className="space-y-4">
              {[].map((item: any) => (
                <div key={item.id} className="rounded-2xl shadow-lg">
                  <div className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-pink-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          S/ {item.price.toFixed(2)} c/u
                        </p>
                      </div>

                      <p className="font-bold text-pink-900 mr-4">
                        S/ {(Number(item.price) * item.stock).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center items-center bg-pink-100 rounded-b-lg mt-1 py-1">
                    <button
                      className="cursor-pointer rounded-lg px-3 py-1 text-pink-600 bg-pink-200 hover:bg-pink-300 font-bold"
                      type="button"
                      aria-label={`Disminuir cantidad de ${item.name}`}
                    >
                      −
                    </button>

                    <span className="px-3 py-1 font-semibold text-pink-900 cursor-default">
                      {item.stock}
                    </span>

                    <button
                      className="cursor-pointer rounded-lg px-3 py-1 text-pink-600 bg-pink-200 hover:bg-pink-300 font-bold"
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.name}`}
                    >
                      +
                    </button>

                    <button
                      className="cursor-pointer text-sm text-red-500 hover:text-red-700 ml-4"
                      type="button"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {[].length > 0 && (
          <div
            id="cart-footer"
            className="border-t border-pink-200 p-6 space-y-4 bg-pink-50"
          >
            <div className="space-y-3">
              <input
                type="text"
                id="customer-name"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition"
              />
              <input
                type="text"
                id="customer-address"
                placeholder="Tu dirección de entrega"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between text-2xl font-bold text-pink-900">
              <span>Total:</span>
              <span id="cart-total">S/ {(9.0).toFixed(2)}</span>
            </div>

            <div className="flex gap-3">
              <button
                id="clear-cart"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full transition"
                type="button"
              >
                Vaciar Carrito
              </button>

              <button
                id="send-order"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg hover:shadow-xl"
                type="button"
              >
                Enviar Pedido 📱
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
