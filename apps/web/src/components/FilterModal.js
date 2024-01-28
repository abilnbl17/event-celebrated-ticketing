// FilterModal.js

import React, { useState } from 'react';

const FilterModal = ({ isOpen, onClose, applyFilters }) => {
  const [onlineEventFilter, setOnlineEventFilter] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    today: false,
    tomorrow: false,
    thisWeekend: false,
  });
  const [priceFilters, setPriceFilters] = useState({
    paid: false,
    free: false,
  });
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleOnlineEventChange = () => {
    setOnlineEventFilter((prevFilter) => !prevFilter);
  };

  const handleDateChange = (filter) => {
    setDateFilters((prevFilters) => ({
      today: filter === 'today' && !prevFilters.today,
      tomorrow: filter === 'tomorrow' && !prevFilters.tomorrow,
      thisWeekend: filter === 'thisWeekend' && !prevFilters.thisWeekend,
    }));
  };

  const handlePriceChange = (filter) => {
    setPriceFilters((prevFilters) => ({
      paid: filter === 'paid' && !prevFilters.paid,
      free: filter === 'free' && !prevFilters.free,
    }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? '' : category,
    );
  };

  const handleApplyFilters = () => {
    applyFilters({
      onlineEventFilter,
      dateFilters,
      priceFilters,
      selectedCategory,
    });
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="text-xl font-semibold mb-2">Filters</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          <label className="block mb-2 text-base">
            <input
              type="checkbox"
              className="mr-2"
              checked={onlineEventFilter}
              onChange={handleOnlineEventChange}
            />
            Online Event
          </label>
          {/* Checkbox Date */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Date</h2>
            {Object.entries(dateFilters).map(([filter, checked]) => (
              <label key={filter} className="block mb-2 text-base">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checked}
                  onChange={() => handleDateChange(filter)}
                />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </label>
            ))}
          </div>

          {/* Checkbox Price */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Price</h2>
            {Object.entries(priceFilters).map(([filter, checked]) => (
              <label key={filter} className="block mb-2 text-base">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={checked}
                  onChange={() => handlePriceChange(filter)}
                />
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </label>
            ))}
          </div>

          {/* Filter Category */}
          <div className="mb-4">
            <h2 className="text-base font-semibold mb-2">Category</h2>
            {['music', 'seminar', 'etc'].map((category) => (
              <label key={category} className="block mb-2 text-base">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>

          <button
            className="bg-black text-white p-2 rounded"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
