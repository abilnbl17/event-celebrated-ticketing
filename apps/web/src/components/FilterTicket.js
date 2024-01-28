'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Ticket from './ticket';
import Image from 'next/image';

export const FilterTicket = () => {
  const [selectedButton, setSelectedButton] = useState('Upcoming');
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleClick = (button) => {
    setSelectedButton(button);
    setCurrentPage(1);
  };

  const fetchEvents = async () => {
    try {
      let queryParams = {};
      const token = localStorage.getItem('token');

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      switch (selectedButton) {
        case 'Upcoming':
          queryParams.filter = 'Upcoming';
          break;
        case 'History':
          queryParams.filter = 'History';
          break;
      }

      queryParams.page = currentPage;

      const response = await axios.get('http://localhost:8000/ticket', {
        params: queryParams,
        headers: headers, // Sertakan header Authorization di sini
      });

      const fetchedData = response.data;
      setEvents(fetchedData);

      // Periksa apakah 'meta' dan 'totalPages' tersedia
      if (fetchedData.meta && fetchedData.meta.totalPages !== undefined) {
        setTotalPages(fetchedData.meta.totalPages);
      } else {
        setTotalPages(1); // Atur nilai default jika 'totalPages' tidak tersedia
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedButton, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="flex text-2xl flex-row gap-5 ">
        <button
          className={`custom-button ${
            selectedButton === 'Upcoming' ? 'clicked' : ''
          }`}
          onClick={() => handleClick('Upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`custom-button ${
            selectedButton === 'History' ? 'clicked' : ''
          }`}
          onClick={() => handleClick('History')}
        >
          History
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <div className="flex justify-center" key={event.id}>
              <Ticket event={event} />
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
    </>
  );
};
