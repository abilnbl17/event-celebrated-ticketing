'use client';

import OrganizerEvents from '@/components/OrganizerEvents';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const eventOrganizer = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(
        'http://localhost:8000/organizer/event',
        {
          headers: headers,
        },
      );

      const fetchedData = response.data;
      setEvents(fetchedData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="wrapper flex flex-col gap-5">
      <h1 className="h1-bold">My Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <div className="flex justify-center" key={event.id}>
              <OrganizerEvents event={event} />
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
    </div>
  );
};

export default eventOrganizer;
