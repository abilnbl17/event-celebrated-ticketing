'use client';
import Card from '@/components/Card';
import FilterModal from '@/components/FilterModal';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

const SearchPage = () => {
  const pageSize = 6;
  // State untuk melacak search
  const [search, setSearch] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  // use debounce
  const [debounceValue] = useDebounce(search, 500);
  // State untuk resp fething
  const [data, setData] = useState([]);
  // State array kategori
  const [categories, setCategories] = useState([]);
  // State untuk melacak nomor halaman saat ini
  const [currentPage, setCurrentPage] = useState(1);
  // State untuk melacak online
  const [onlineEventFilter, setOnlineEventFilter] = useState(false);
  // State untuk melacak status checkbox Date
  const [dateFilters, setDateFilters] = useState({
    today: false,
    tomorrow: false,
    thisWeekend: false,
  });
  // State untuk viewmore kategori
  const [isViewMore, setIsViewMore] = useState(false);
  const MAX_DISPLAY_CATEGORIES = 5;
  // State untuk melacak status checkbox Price
  const [priceFilters, setPriceFilters] = useState({
    paid: false,
    free: false,
  });
  // State untuk melacak status checkbox Category
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fungsi untuk menangani perubahan halaman
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Fungsi untuk menangani online
  const handleOnlineEventChange = () => {
    setOnlineEventFilter((prevFilter) => !prevFilter);
  };

  //apply filtermodal
  const applyFilters = (filters) => {
    console.log('Applied filters:', filters);
    setOnlineEventFilter(filters.onlineEventFilter);
    setDateFilters(filters.dateFilters);
    setPriceFilters(filters.priceFilters);
    setSelectedCategory(filters.selectedCategory);
  };

  // Fungsi untuk menangani perubahan status checkbox Date
  const handleDateChange = (filter) => {
    setDateFilters((prevFilters) => ({
      today: filter === 'today' && !prevFilters.today,
      tomorrow: filter === 'tomorrow' && !prevFilters.tomorrow,
      thisWeekend: filter === 'thisWeekend' && !prevFilters.thisWeekend,
    }));
  };

  // Fungsi untuk menangani perubahan status checkbox Price
  const handlePriceChange = (filter) => {
    setPriceFilters((prevFilters) => ({
      paid: filter === 'paid' && !prevFilters.paid,
      free: filter === 'free' && !prevFilters.free,
    }));
  };

  // Fungsi untuk menangani perubahan status checkbox Category
  const handleCategoryChange = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? '' : category,
    );
  };

  // Pemanggilan API untuk mendapatkan daftar kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const filters = {
        is_online: onlineEventFilter,
        is_free:
          priceFilters.free || (priceFilters.paid ? { is_free: false } : null),
        category: selectedCategory.toString(),
        search: debounceValue,
        page: currentPage.toString(),
      };

      if (dateFilters.today) {
        filters.start_date = new Date().toISOString().split('T')[0];
        filters.end_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0]; // Next day
      } else if (dateFilters.tomorrow) {
        filters.start_date = new Date(
          new Date().getTime() + 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0];
        filters.end_date = new Date(
          new Date().getTime() + 2 * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split('T')[0]; // Next day
      } else if (dateFilters.thisWeekend) {
        const today = new Date();
        const daysUntilWeekend = 5 - today.getDay(); // 5 is Saturday
        const todayForWeekend = new Date(today);
        todayForWeekend.setDate(todayForWeekend.getDate() + daysUntilWeekend);
        todayForWeekend.setHours(0, 0, 0, 0);
        const nextMonday = new Date(todayForWeekend);
        nextMonday.setDate(todayForWeekend.getDate() + 2); // 2 days for the weekend

        filters.start_date = todayForWeekend.toISOString().split('T')[0];
        filters.end_date = nextMonday.toISOString().split('T')[0];
      }

      const activeFilters = Object.keys(filters).reduce((acc, key) => {
        if (filters[key]) {
          acc[key] = filters[key];
        }
        return acc;
      }, {});

      const queryParams = new URLSearchParams(activeFilters).toString();

      try {
        const response = await axios.get(
          `http://localhost:8000/event/discovery?${queryParams}`,
        );
        const fetchedData = response.data;
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setData([]);
      }
    };

    fetchData();
  }, [
    debounceValue,
    onlineEventFilter,
    dateFilters,
    priceFilters,
    selectedCategory,
    currentPage,
  ]);

  return (
    <div className="wrapper flex flex-col md:flex-row-reverse min-h-screen">
      <main className="w-full md:w-full lg:w-5/6 px-6 pb-6">
        <h1 className="text-3xl font-semibold mb-4">Find Event</h1>

        <form className=" mb-1 lg:mb-4 md:flex md:items-center w-full sm:w-full lg:w-1/2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-gray-300 rounded-l  w-full md:mb-0 md:flex-1"
          />
        </form>
        <button
          className="bg-black text-white p-2 rounded block mb-2 lg:hidden"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Open Filters
        </button>
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          applyFilters={applyFilters}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {Array.isArray(data) && data.length > 0 ? (
            data.map((event) => (
              <div className="flex justify-center" key={event.id}>
                <Card event={event} />
              </div>
            ))
          ) : (
            <>
              <Image
                src="/assets/images/notfound.jpg"
                alt="notfound"
                height={1000}
                width={1000}
              />
            </>
          )}
        </div>

        <div className="mt-4 flex justify-center items-center">
          {data.length >= pageSize && (
            <>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-2 border rounded"
              >
                Previous
              </button>
              <span className="mx-2">{currentPage}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={data.length < pageSize}
                className="px-3 py-1 mx-2 border rounded"
              >
                Next
              </button>
            </>
          )}
        </div>
      </main>

      <aside className="hidden lg:block w-1/6 p-6 pl-0 pt-0">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Filters</h2>
          <label className="block mb-2 text-base">
            <input
              type="checkbox"
              className="mr-2"
              checked={onlineEventFilter}
              onChange={handleOnlineEventChange}
            />
            Online Event
          </label>
        </div>

        <h2 className="text-base font-semibold mb-2">Date</h2>
        <label className="block mb-2 text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={dateFilters.today}
            onChange={() => handleDateChange('today')}
          />
          Today
        </label>
        <label className="block mb-2 text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={dateFilters.tomorrow}
            onChange={() => handleDateChange('tomorrow')}
          />
          Tomorrow
        </label>
        <label className="block mb-2 text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={dateFilters.thisWeekend}
            onChange={() => handleDateChange('thisWeekend')}
          />
          This Weekend
        </label>

        <h2 className="text-base font-semibold mb-2">Price</h2>
        <label className="block mb-2 text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={priceFilters.paid}
            onChange={() => handlePriceChange('paid')}
          />
          Paid
        </label>
        <label className="block mb-2 text-base">
          <input
            type="checkbox"
            className="mr-2"
            checked={priceFilters.free}
            onChange={() => handlePriceChange('free')}
          />
          Free
        </label>

        <div className="mb-4 mt-4">
          <h2 className="text-base font-semibold mb-2">Category</h2>
          {categories
            .slice(0, isViewMore ? categories.length : MAX_DISPLAY_CATEGORIES)
            .map((category) => (
              <label key={category} className="block mb-2 text-base">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                {category}
              </label>
            ))}
          {categories.length > MAX_DISPLAY_CATEGORIES && (
            <button
              className="text-blue-500 underline mt-2"
              onClick={() => setIsViewMore((prev) => !prev)}
            >
              {isViewMore ? 'View Less' : 'View More'}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default SearchPage;
