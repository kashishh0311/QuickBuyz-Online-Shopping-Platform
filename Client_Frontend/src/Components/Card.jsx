import { useState, useEffect } from "react";
import Button from "../Components/Button";
import CartButton from "../Components/CartButton";
import { Link } from "react-router-dom";
import { useCart } from "../CartContext";

function Card({
  id,
  name,
  price,
  ProductImage,
  isAvailable,
  averageRating,
  totalRatings,
}) {
  const { addToCart, cart } = useCart();
  const [isInCart, setIsInCart] = useState(false);
  const [cartItem, setCartItem] = useState(null);

  useEffect(() => {
    const foundItem = cart.find((item) => item.productId._id === id);
    setIsInCart(!!foundItem);
    setCartItem(foundItem);
  }, [cart, id]);

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(id);
    }
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating); // Round to nearest integer for stars
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={i < roundedRating ? "orange" : "none"}
            stroke="orange"
            strokeWidth="1"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
      <Link to={`/product/${id}`}>
        <div className="relative h-52 w-full bg-gray-200 mb-4 rounded-lg overflow-hidden">
          <img
            src={ProductImage || "/fallback-image.jpg"}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.target.src = "/fallback-image.jpg")}
          />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600">₹{price}</p>
        {/* Display Stars for Average Rating */}
        {averageRating ? (
          <div className="flex justify-start items-center gap-2 mt-2">
            {renderStars(averageRating)}
            <span className="text-gray-500 text-sm">
              ({totalRatings} ratings)
            </span>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No ratings yet</p>
        )}
        <p
          className={`text-sm mt-2 ${
            isAvailable ? "text-green-600" : "text-red-600"
          } mb-2`}
        >
          {isAvailable ? "in Stock" : "Out of Stock"}
        </p>
      </Link>
      {isInCart ? (
        <CartButton product={{ _id: id, ...cartItem }} />
      ) : (
        <Button
          text="Add to Cart"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`mt-0 ${
            !isAvailable ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
      )}
    </div>
  );
}

export default Card;
