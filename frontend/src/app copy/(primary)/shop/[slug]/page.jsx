"use client";
require('dotenv').config();

import React, { useState, useEffect } from 'react';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Paginations from '../../../../components/Paginations/Paginations';
import BoxProduct from '../../../../components/BoxProduct/BoxProduct';
import Shop_Filter_Price from '../../../../components/Shop_Filter_Price/Shop_Filter_Price';
import Loading from '../../../../components/Loading/Loading';
import { getCategories } from '../../../../services/categoryService';
import { getProductsCategory } from '../../../../services/productService';
import { getProductsCountByCategory } from '../../../../services/productService';

const imageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
const URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function Shop({ params }) {
  const [showFilter, setShowFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("ascending");
  useEffect(() => {
    document.title = "FoodHaven Shop";

    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();

        const categoriesWithCounts = await Promise.all(
          categoriesData.map(async (category) => {
            const count = await getProductsCountByCategory(category.tag_ct);
            return { ...category, count: count.count };
          })
        );

        setCategories(categoriesWithCounts);

        // Fetch products based on params (category tag)
        const productsCategoryData = await getProductsCategory(params.slug);
        if (productsCategoryData && productsCategoryData) {
          setProducts(productsCategoryData);
          setCurrentPage(productsCategoryData.currentPage);
          setTotalPages(productsCategoryData.totalPages);
        } else {
          setProducts([]);
          setCurrentPage(1);
          setTotalPages(0);
        }
      } catch (error) {
        console.error('Failed to fetch products or categories:', error);
        setProducts([]);
        setCurrentPage(1);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, params.categoryTag]);

  useEffect(() => {
    handleSort(products);
  }, [sort]);

  function handleSort(listPro) {
    let cpyPro = [...listPro];
    if (sort === "ascending") {
      cpyPro.sort((firstPro, secondPro) => firstPro.name_pr.localeCompare(secondPro.name_pr));
    } else if (sort === "desending") {
      cpyPro.sort((firstPro, secondPro) => secondPro.name_pr.localeCompare(firstPro.name_pr));
    }
    setProducts(cpyPro);
  }

  return (
    <div>
      {/* Filter Overlay */}
      <div className={`w-full h-screen fixed top-0 left-0 bg-white text-black z-50 transition-transform duration-300 ${showFilter ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className='p-4'>
          <button onClick={() => setShowFilter(false)} className='text-black text-3xl'>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className='mb-4 p-4'>
          <div className='font-bold text-xl mb-2'>Category</div>
          <div className="form-control">
            {categories.map((category, i) => (
              <a href={`${URL}/shop/${category.tag_ct}`} className="cursor-pointer label mb-2 flex justify-between" key={category._id}>
                <span className="label-text text-text_1">{category.name_ct}</span>
                <p>({category.count})</p>
              </a>
            ))}
          </div>
        </div>
        <div className='mb-4 p-4'>
          <div className='font-bold text-xl mb-2'>Filter By Price</div>
          <Shop_Filter_Price />
        </div>
        <div className='p-4'>
          <div className='font-bold text-xl mb-2'>Product Tags</div>
          <div className='flex flex-wrap'>
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className='border-b text-text_1 mr-2 w-fit hover:text-primary border-primary cursor-pointer'>Tag {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Filter Button for Mobile */}
      <div className='bg-white text-black text-right p-4 lg:hidden block'>
        <button onClick={() => setShowFilter(true)} className='text-3xl'>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      {/* Main Content */}
      <div className='lg:px-40 px-2 bg-white py-4 mb-20'>
        {/* Breadcrumb */}
        <div className="mb-4">
          <ol className="flex items-center whitespace-nowrap">
            <li className="inline-flex items-center">
              <a className="flex items-center text-sm text-gray-500 hover:text-blue-600 focus:outline-none focus:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-500 dark:focus:text-blue-500" href="#">
                Home
              </a>
              <svg className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400 dark:text-neutral-600" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
            <li className="inline-flex items-center text-sm font-semibold text-primary truncate dark:text-neutral-200" aria-current="page">
              Products
            </li>
          </ol>
        </div>
        <div className='flex lg:flex-row flex-col-reverse gap-10 mb-20'>
          <div className='lg:w-3/4'>
            <div className='lg:flex mb-4 hidden'>
              <div className='flex items-center mr-6'>
                <div className='mr-4 text-black'>Sort By: </div>
                <div className="relative w-60 max-w-full mx-auto">
                  <select value={sort} onChange={(event) => setSort(event.target.value)} name="sort" className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none">
                    <option value="" id="">Please Select Option</option>
                    <option value="ascending" id="ascending">Sort A - Z</option>
                    <option value="desending" id="desending">Sort Z - A</option>
                  </select>
                </div>
              </div>
              <div className='flex items-center'>
                <div className='mr-4 text-black'>Show: </div>
                <div className="relative w-60 max-w-full mx-auto">
                  <select className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none">
                    <option>Project manager</option>
                    <option>Software engineer</option>
                    <option>IT manager</option>
                    <option>UI / UX designer</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Product Grid */}
            <div className='grid lg:grid-cols-3 lg:gap-10 grid-cols-2 gap-3'>
              {loading ? (
                <Loading />
              ) : (
                products && products.length === 0 ? (
                  <div className='text-black w-[840px] h-screen flex items-center justify-center'>No products found.</div>
                ) : (
                  products.map((product) => (
                    <BoxProduct key={product._id} product={product} />
                  ))
                )
              )}
            </div>
            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
          {/* Sidebar */}
          <div className='lg:w-1/4 lg:block hidden px-4 text-black'>
            <div className='mb-4'>
              <div className='font-bold text-xl mb-2'>Category</div>
              <div className="form-control">
                {categories.map((category, i) => (
                  <a href={`${URL}/shop/${category.tag_ct}`} className="cursor-pointer label mb-2 flex justify-between" key={category.id}>
                    <span className="label-text text-text_1">{category.name_ct}</span>
                    <p>({category.count})</p>
                  </a>
                ))}
              </div>
            </div>
            <div className='mb-4'>
              <img src={`${imageURL}/shop_2.png`} alt="" className='w-full object-cover h-[300px]' />
            </div>
            <div className='mb-4'>
              <div className='font-bold text-xl mb-2'>Filter By Price</div>
            </div>
            <div>
              <div className='font-bold text-xl mb-2'>Product Tags</div>
              <div className='flex flex-wrap'>
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className='border-b text-text_1 mr-2 w-fit hover:text-primary border-primary cursor-pointer'>Tag {i + 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;