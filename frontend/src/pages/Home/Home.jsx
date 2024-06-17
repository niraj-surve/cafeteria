import React, { useEffect } from "react";
import ProductCards from "../../components/ProductCards/ProductCards";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../store/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { data: products, tags, status } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch]);

  return (
    <>
      <ProductCards products={products} tags={tags} status={status} />
    </>
  );
};

export default Home;
