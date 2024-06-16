import React, { useState } from "react";
import { keyframes } from "@emotion/react";
import Rating from "react-rating";
import { FaStar, FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import Reveal from "react-awesome-reveal";
import StatusCode from "../../util/StatusCode";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import toast from "react-hot-toast";

const fadeInRight = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const ProductCards = ({ products, status }) => {
  const dispatch = useDispatch();

  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product) => {
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

  const tags = [
    { display: "ALL", value: "all" },
    { display: "STRONG", value: "strong" },
    { display: "MILKY", value: "milky" },
    { display: "SWEET", value: "sweet" },
    { display: "BLACK", value: "black" },
    { display: "LIGHT", value: "light" },
  ];

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
    return <div>Error loading data: {error}</div>;
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
          const { id, name, price, favourite, stars, image, tags } = product;
          return (
            <Reveal key={id} keyframes={fadeInRight} delay={100} triggerOnce>
              <div
                className="max-md:w-[300px] md:w-[280px] h-[440px] max-sm:text-sm bg-white p-8 rounded-lg hover:cursor-pointer"
                style={{
                  animationDelay: `100ms`,
                  boxShadow: "0 0 5px gray",
                }}
              >
                <div className="flex flex-col gap-6 items-center">
                  <Link to={`/product/${id}`}>
                    <img
                      className="rounded-lg"
                      src={`../../assets/coffee/${image}`}
                      alt={`${name} Image`}
                    />
                  </Link>
                  <div className="w-full flex flex-col gap-2 font-mulish">
                    <button className="absolute">
                      {favourite ? (
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
                      <Link to={`/product/${id}`}>
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
                      className="mt-2 flex items-center bg-primary rounded-full font-opensans w-fit self-center hover:scale-[1.02] hover:duration-[300ms]"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="bg-white relative left-[6px] rounded-full p-1">
                        <MdOutlineShoppingCart className="text-primary rounded-full" />
                      </span>
                      <span className="py-2 px-4 text-white bg-primary rounded-full uppercase text-sm font-bold">
                        Add to cart
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