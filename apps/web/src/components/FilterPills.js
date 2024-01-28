const FilterPill = ({ label, onRemove }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full p-2 mr-2 mb-2">
      <span className="mr-1">{label}</span>
      <button onClick={onRemove}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default FilterPill;
