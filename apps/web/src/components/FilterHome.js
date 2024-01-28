'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

export const FilterHome = () => {
  const [selectedButton, setSelectedButton] = useState('');
  const [events, setEvents] = useState([]);

  const handleClick = (button) => {
    setSelectedButton(button);
  };
  const itemsPerPage = 8;
  useEffect(() => {
    // Fetch events based on selectedButton using Axios
    const fetchEvents = async () => {
      try {
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
              take: itemsPerPage,
            },
          },
        );

        const fetchedData = response.data;
        setEvents(fetchedData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Fetch events when selectedButton changes
    fetchEvents();
  }, [selectedButton]);

  return (
    <>
      <h2 className="h2-bold">
        Trust by <br /> Thousand of Events
      </h2>
      <div className="flex  flex-row gap-5 ">
        <button
          className={`custom-button ${
            selectedButton === 'All' ? 'clicked' : ''
          }`}
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <div className="flex justify-center" key={event.id}>
              <Card event={event} />
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </>
  );
};
