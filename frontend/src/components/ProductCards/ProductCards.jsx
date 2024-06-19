import React, { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import Rating from "react-rating";
import { FaStar, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import Reveal from "react-awesome-reveal";
import StatusCode from "../../util/StatusCode";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, getProductsTags } from "../../store/productSlice";
import { selectUser, toggleFavorite } from "../../store/userSlice";
import { addToCart } from "../../store/cartSlice";

const fadeInRight = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ProductCards = () => {
  const dispatch = useDispatch();
  const {
    data: products,
    status,
    tags,
  } = useSelector((state) => state.product);
  const user = useSelector(selectUser);
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getProducts());
    dispatch(getProductsTags());
  }, [dispatch]);

  const handleToggleFavourite = (productId) => {
    if (!user) {
      toast.error("Please log in to add to favorites!", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }
    dispatch(toggleFavorite(productId));
  };

  const handleAddToCart = (userId, _id, name, price, image, token) => {
    dispatch(addToCart({ userId, _id, name, price, image, token }));
  };

  const isProductInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };

  const filteredProducts = products.filter((product) => {
    const matchesTag =
      selectedTag === "all" || product.tags.includes(selectedTag);
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTag && matchesSearch;
  });

  if (status === StatusCode.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === StatusCode.ERROR) {
    return <div>Error loading data: {status}</div>;
  }

  return (
    <div className="menu-main flex flex-col items-center pb-10">
      <div id="search" className="py-6">
        <span className="flex border-[3px] rounded-lg border-primary items-center">
          <input
            type="text"
            name="search"
            id="searchbar"
            placeholder="Search"
            className="text-sm w-[250px] rounded-lg px-2 py-1 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="relative right-2 text-primary" />
        </span>
      </div>
      <div className="w-full flex max-md:flex-col gap-4 justify-center items-center text-center pb-10">
        <ul className="flex gap-4 font-mulish text-sm">
          {tags.map((tag, index) => (
            <li
              key={index}
              className={`cursor-pointer hover:text-primary ${
                selectedTag === tag.value ? "font-bold text-primary" : ""
              }`}
              onClick={() => setSelectedTag(tag.value)}
            >
              {tag.display}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 grid max-md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-10">
        {filteredProducts.map((product) => {
          const { _id, name, price, stars, image, tags } = product;
          const isFavourite = user && user.favourites.includes(_id);

          return (
            <Reveal key={_id} keyframes={fadeInRight} delay={100} triggerOnce>
              <div
                className="max-md:w-[300px] md:w-[280px] h-[440px] max-sm:text-sm bg-white p-8 rounded-lg hover:cursor-pointer"
                style={{
                  animationDelay: `100ms`,
                  boxShadow: "0 0 5px gray",
                }}
              >
                <div className="flex flex-col gap-6 items-center">
                  <Link to={`/product/${_id}`}>
                    <img
                      className="rounded-lg"
                      src={`/products/${image}`}
                      alt={`${name} Image`}
                    />
                  </Link>
                  <div className="w-full flex flex-col gap-2 font-mulish">
                    <button
                      className="absolute"
                      onClick={() => handleToggleFavourite(product._id)}
                    >
                      {isFavourite ? (
                        <FaHeart className="text-red-600 text-xl" />
                      ) : (
                        <FaRegHeart className="text-dark text-xl" />
                      )}
                    </button>
                    <Rating
                      className="self-end"
                      emptySymbol={<FaStar className="text-slate-400" />}
                      fullSymbol={<FaStar className="text-yellow-500" />}
                      initialRating={stars}
                      readonly
                    />
                    <div className="flex gap-2 justify-between">
                      <Link to={`/product/${_id}`}>
                        <h3 className="text-dark font-bold text-lg">{name}</h3>
                      </Link>
                      <span className="text-xs border border-primary text-muted px-2 py-1 rounded-full shadow-4xl">
                        {tags[0]}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 justify-between w-full text-sm">
                      <span>Price: ₹{price}</span>
                    </div>
                    <button
                      className={`mt-2 flex items-center rounded-full font-opensans w-fit self-center ${
                        isProductInCart(_id)
                          ? "bg-success"
                          : "hover:scale-[1.02] hover:duration-[300ms] bg-primary"
                      }`}
                      onClick={() => {
                        if (!user) {
                          toast.error("Please log in to add to cart!", {
                            position: "bottom-right",
                            duration: 3000,
                          });
                          return;
                        }
                        handleAddToCart(
                          user.id,
                          _id,
                          name,
                          price,
                          image,
                          user.token
                        );
                      }}
                      disabled={isProductInCart(_id)}
                    >
                      {!isProductInCart(_id) ? (
                        <span className="bg-white relative left-[6px] rounded-full p-1">
                          <MdOutlineShoppingCart className="text-primary rounded-full" />
                        </span>
                      ) : (
                        ""
                      )}
                      <span className="py-2 px-4 text-white rounded-full uppercase text-sm font-bold">
                        {isProductInCart(_id) ? "In Cart" : "Add to Cart"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
        {filteredProducts.length === 0 && (
          <Reveal
            className="w-full top-[50vh] absolute"
            keyframes={fadeInRight}
            delay={100}
            triggerOnce
          >
            <div className="text-center text-primary text-xl font-mulish">
              No products match the search query!
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default ProductCards;
