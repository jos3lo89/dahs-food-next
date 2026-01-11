// // app/(landing)/components/ProductCard.tsx
// "use client";

// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useCartStore } from "@/store/cartStore";
// import { Producto, ProductsI } from "@/types/products";
// import { Minus, Plus, ShoppingCart, Star, Clock } from "lucide-react";
// import Image from "next/image";

// type Props = {
//   product: Producto;
//   featured?: boolean;
// };

// const ProductCard = ({ product, featured = false }: Props) => {
//   const { increaseQuantity, decreaseQuantity, getItemQuantity, addItem } =
//     useCartStore();
//   const quantity = getItemQuantity(product.id);

//   const handleAddToCart = () => {
//     addItem(product);
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-lg overflow-hidden card-hover group relative">
//       {/* Badges */}
//       <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
//         {featured && (
//           <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
//             <Star className="w-3 h-3 mr-1 fill-current" />
//             Destacado
//           </Badge>
//         )}
//         {product.stock < 10 && product.stock > 0 && (
//           <Badge variant="destructive">
//             <Clock className="w-3 h-3 mr-1" />
//             ¡Últimas unidades!
//           </Badge>
//         )}
//         {product.stock === 0 && <Badge variant="secondary">Agotado</Badge>}
//       </div>

//       {/* Imagen */}
//       <div className="relative h-56 overflow-hidden bg-gray-100">
//         <img
//           src="https://res.cloudinary.com/dnmp8sdlk/image/upload/v1766893855/dahs-fotos/i3qjmcm1dlnvono9as6i.jpg"
//           alt="wadafaf"
//         />

//         {/* <Image
//           src={product.image}
//           alt={product.name}
//           fill
//           className="object-cover transition-transform duration-500 group-hover:scale-110"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           priority={featured}
//           unoptimized={false}
//         /> */}

//         {/* Precio Badge */}
//         <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg z-10">
//           S/ {Number(product.price).toFixed(2)}
//         </div>

//         {/* Overlay en hover */}
//         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
//       </div>

//       {/* Contenido */}
//       <div className="p-6">
//         {/* Categoría */}
//         <p className="text-xs text-pink-500 font-semibold mb-1 uppercase">
//           {product.category.name}
//         </p>

//         {/* Nombre */}
//         <h3 className="text-xl font-bold text-pink-900 mb-2 line-clamp-2">
//           {product.name}
//         </h3>

//         {/* Descripción */}
//         {product.description && (
//           <p className="text-gray-600 text-sm mb-4 line-clamp-2">
//             {product.description}
//           </p>
//         )}

//         {/* Stock indicator */}
//         {product.stock > 0 && product.stock < 10 && (
//           <div className="mb-4">
//             <div className="flex items-center gap-2 text-xs text-orange-600">
//               <div className="flex-1 bg-gray-200 rounded-full h-1.5">
//                 <div
//                   className="bg-orange-500 h-1.5 rounded-full"
//                   style={{ width: `${(product.stock / 10) * 100}%` }}
//                 ></div>
//               </div>
//               <span className="font-semibold">{product.stock} disponibles</span>
//             </div>
//           </div>
//         )}

//         {/* Botones de acción */}
//         {product.stock === 0 ? (
//           <Button
//             disabled
//             className="w-full bg-gray-300 text-gray-500 cursor-not-allowed rounded-full"
//           >
//             Agotado
//           </Button>
//         ) : quantity > 0 ? (
//           <div className="flex items-center justify-center gap-4">
//             <div className="flex items-center bg-pink-50 rounded-full overflow-hidden shadow-md">
//               <Button
//                 variant="ghost"
//                 className="px-4 py-2 rounded-l-full text-pink-600 hover:bg-pink-200 transition font-bold"
//                 onClick={() => decreaseQuantity(product.id)}
//               >
//                 <Minus className="w-4 h-4" />
//               </Button>
//               <span className="px-6 py-2 font-bold text-pink-900 text-lg min-w-12 text-center">
//                 {quantity}
//               </span>
//               <Button
//                 variant="ghost"
//                 className="px-4 py-2 rounded-r-full text-pink-600 hover:bg-pink-200 transition font-bold"
//                 onClick={() => increaseQuantity(product.id)}
//               >
//                 <Plus className="w-4 h-4" />
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <Button
//             className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg group"
//             onClick={handleAddToCart}
//           >
//             <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
//             Agregar al carrito
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductCard;

// app/(landing)/components/ProductCard.tsx - ACTUALIZAR
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { Producto } from "@/types/products";
import { Minus, Plus, ShoppingCart, Star, Clock } from "lucide-react";
import Image from "next/image";

type Props = {
  product: Producto;
  featured?: boolean;
};

const ProductCard = ({ product, featured = false }: Props) => {
  const { increaseQuantity, decreaseQuantity, getItemQuantity, addItem } =
    useCartStore();
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden card-hover group relative">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {featured && (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Destacado
          </Badge>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <Badge variant="destructive">
            <Clock className="w-3 h-3 mr-1" />
            ¡Últimas unidades!
          </Badge>
        )}
        {product.stock === 0 && <Badge variant="secondary">Agotado</Badge>}
      </div>

      {/* Imagen - ✅ CORREGIDO */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Precio Badge */}
        <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg z-10">
          S/ {Number(product.price).toFixed(2)}
        </div>

        {/* Overlay en hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Categoría */}
        <p className="text-xs text-pink-500 font-semibold mb-1 uppercase">
          {product.category.name}
        </p>

        {/* Nombre */}
        <h3 className="text-xl font-bold text-pink-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Descripción */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Stock indicator */}
        {product.stock > 0 && product.stock < 10 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-orange-600">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{ width: `${(product.stock / 10) * 100}%` }}
                ></div>
              </div>
              <span className="font-semibold">{product.stock} disponibles</span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        {product.stock === 0 ? (
          <Button
            disabled
            className="w-full bg-gray-300 text-gray-500 cursor-not-allowed rounded-full"
          >
            Agotado
          </Button>
        ) : quantity > 0 ? (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center bg-pink-50 rounded-full overflow-hidden shadow-md">
              <Button
                variant="ghost"
                className="px-4 py-2 rounded-l-full text-pink-600 hover:bg-pink-200 transition font-bold"
                onClick={() => decreaseQuantity(product.id)}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-6 py-2 font-bold text-pink-900 text-lg min-w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                className="px-4 py-2 rounded-r-full text-pink-600 hover:bg-pink-200 transition font-bold"
                onClick={() => increaseQuantity(product.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg group"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
            Agregar al carrito
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
