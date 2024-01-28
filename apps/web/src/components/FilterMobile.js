'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';

export const FilterMobile = ({ onFilter }) => {
  const [selectedButton, setSelectedButton] = useState('');
  const [events, setEvents] = useState([]);
  const selectedButtonRef = useRef(selectedButton);

  const handleClick = (button) => {
    setSelectedButton(button);
  };

  useEffect(() => {
    selectedButtonRef.current = selectedButton;
  }, [selectedButton]);

  useEffect(() => {
    // Fetch events based on selectedButton using Axios
    const fetchEvents = async () => {
      try {
        if (selectedButton === selectedButtonRef.current) {
          let queryParams = {};

          // Add additional filtering based on selectedButton
          switch (selectedButton) {
            case 'Online':
              queryParams.is_online = true;
              break;
            case 'Today':
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              queryParams.date_time = {
                gte: today.toISOString(),
                lt: tomorrow.toISOString(),
              };
              break;
            case 'This Weekend':
              const todayForWeekend = new Date();
              const daysUntilWeekend = 5 - todayForWeekend.getDay(); // 5 is Saturday
              todayForWeekend.setDate(
                todayForWeekend.getDate() + daysUntilWeekend,
              );
              todayForWeekend.setHours(0, 0, 0, 0);
              const nextMonday = new Date(todayForWeekend);
              nextMonday.setDate(todayForWeekend.getDate() + 2); // 2 days for the weekend
              queryParams.date_time = {
                gte: todayForWeekend.toISOString(),
                lt: nextMonday.toISOString(),
              };
              break;
            case 'Free':
              queryParams.is_free = true;
              break;
            default:
              // No additional filter needed for 'All'
              break;
          }

          // Fetch events and order by ID and filter by date_time
          const response = await axios.get(
            'http://localhost:8000/event/discovery',
            {
              params: {
                ...queryParams,
                _sort: 'id:ASC',
                date_time: { gte: new Date().toISOString() },
              },
            },
          );

          const limitedEvents = response.data.slice(0, 12);
          setEvents(limitedEvents);

          // Mengirim hasil filter ke komponen induk
          onFilter(limitedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Fetch events when selectedButton changes
    fetchEvents();
  }, [selectedButton, onFilter, selectedButtonRef]);

  return (
    <>
      <button
        className={`custom-button ${selectedButton === 'All' ? 'clicked' : ''}`}
        onClick={() => handleClick('All')}
      >
        All
      </button>
      <button
        className={`custom-button ${
          selectedButton === 'Online' ? 'clicked' : ''
        }`}
        onClick={() => handleClick('Online')}
      >
        Online
      </button>
      <button
        className={`custom-button ${
          selectedButton === 'Today' ? 'clicked' : ''
        }`}
        onClick={() => handleClick('Today')}
      >
        Today
      </button>
      <button
        className={`custom-button ${
          selectedButton === 'This Weekend' ? 'clicked' : ''
        }`}
        onClick={() => handleClick('This Weekend')}
      >
        This Weekend
      </button>
      <button
        className={`custom-button ${
          selectedButton === 'Free' ? 'clicked' : ''
        }`}
        onClick={() => handleClick('Free')}
      >
        Free
      </button>
    </>
  );
};
