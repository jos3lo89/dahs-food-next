import { ProductsI } from "@/types/products";

type Props = {
  product: ProductsI;
};

const ProductCart = ({ product }: Props) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden card-hover">
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-md">
          S/ {Number(product.price).toFixed(2)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-pink-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-pink-50 rounded-full overflow-hidden">
            <button
              className="decrease-btn px-4 py-2 text-pink-600 hover:bg-pink-100 transition font-bold cursor-pointer"
              data-id={product.id}
            >
              −
            </button>
            <span
              className="quantity px-4 py-2 font-semibold text-pink-900 cursor-default"
              data-id={product.id}
            >
              1
            </span>
            <button
              className="increase-btn px-4 py-2 text-pink-600 hover:bg-pink-100 transition font-bold cursor-pointer"
              data-id={product.id}
            >
              +
            </button>
          </div>

          <button
            className="add-to-cart-btn cursor-pointer flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
            data-product={JSON.stringify(product)}
          >
            Agregar 🛒
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
