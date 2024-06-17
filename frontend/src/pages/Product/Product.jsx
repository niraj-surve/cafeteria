import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById, toggleFavourite } from "../../store/productSlice";
import StatusCode from "../../util/StatusCode";
import Rating from "react-rating";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { addToCart } from "../../store/cartSlice";
import toast from "react-hot-toast";
import NotFound from "../NotFound/NotFound";

const Product = () => {
  const dispatch = useDispatch();
  const { product, status, error } = useSelector((state) => state.product);
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!product) return; // Ensure product exists before adding to cart

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );

    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      duration: 3000,
    });
  };

  const handleToggleFavourite = () => {
    if (!product) return; // Ensure product exists before toggling favourite

    const newFavouriteStatus = !product.favourite;
    dispatch(
      toggleFavourite({ id: product.id, favourite: newFavouriteStatus })
    );

    newFavouriteStatus
      ? toast.success(`${product.name} added to favourites!`, {
          position: "bottom-right",
          duration: 3000,
        })
      : toast.error(`${product.name} removed from favourites!`, {
          position: "bottom-right",
          duration: 3000,
        });
  };

  if (status === StatusCode.LOADING) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (status === StatusCode.ERROR) {
    return <NotFound />;
  }

  if (status === StatusCode.IDLE && !product) {
    return <div className="text-center">No product found.</div>;
  }

  const isInCart = cartItems.some((item) => item.id === product.id);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <img
          src={`/coffee/${product?.image}`}
          alt={product?.name}
          className="w-full md:w-1/2 object-cover rounded-lg shadow-md"
        />
        <div className="md:ml-8 mt-4 md:mt-0">
          <span className="flex justify-between items-center">
            <h1 className="text-4xl font-bold font-opensans">
              {product?.name}
            </h1>
            <button onClick={handleToggleFavourite}>
              {product?.favourite === true ? (
                <FaHeart className="text-red-600 text-xl" />
              ) : (
                <FaRegHeart className="text-dark text-xl" />
              )}
            </button>
          </span>
          <p className="text-lg mt-2 text-gray-600 text-justify font-mulish">
            {product?.description}
          </p>
          <p className="text-xl mt-4 font-semibold">
            Price: <span className="text-success">₹ {product?.price}</span>
          </p>
          <p className="text-lg mt-2">
            Time required to cook: {product?.cookTime} minutes
          </p>
          <div className="mt-4">
            <span className="text-lg font-semibold">Origins: </span>
            {product?.origins.map((origin, index) => (
              <span
                key={index}
                className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium mr-2"
              >
                {origin}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <span className="text-lg font-semibold">Tags: </span>
            {product?.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-sm font-medium mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <span className="text-lg font-semibold">Rating: </span>
            <Rating
              className="self-end"
              emptySymbol={<FaStar className="text-slate-400" />}
              fullSymbol={<FaStar className="text-yellow-500" />}
              initialRating={product?.stars}
              readonly
            />
          </div>
          <button
            className={`mt-4 flex items-center ${
              isInCart ? "bg-success" : "bg-primary"
            } rounded-full font-opensans w-fit self-center hover:scale-[1.02] hover:duration-[300ms]`}
            onClick={handleAddToCart}
          >
            {!isInCart && (
              <span className="bg-white relative left-[6px] rounded-full p-1">
                <MdOutlineShoppingCart className="text-primary rounded-full" />
              </span>
            )}
            <span className="py-2 px-4 text-white rounded-full uppercase text-sm font-bold">
              {isInCart ? "In Cart" : "Add to cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
