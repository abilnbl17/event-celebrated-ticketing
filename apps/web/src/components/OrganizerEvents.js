'use client';
import Link from 'next/link';
import { useState } from 'react';
import CouponModal from './CouponModal';

const OrganizerEvents = ({ event }) => {
  const [couponModal, setCouponModal] = useState(false);
  const [eventId, setEventId] = useState(null);

  const formatDate = (isoDate) => {
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', options);
  };

  const handleCouponSubmit = (couponData) => {
    console.log('Coupon submitted:', couponData, eventId);
    handleCloseCouponModal();
  };

  const handleOpenCouponModal = (eventId) => {
    setEventId(eventId);
    setCouponModal(true);
  };

  const handleCloseCouponModal = () => {
    setCouponModal(false);
  };

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link
        href={`/events/${event.id}`}
        style={{ backgroundImage: `url(${event.image})` }} // url gambar
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-gray-500"
      />
      <div
        href={`/events/${event.id}`}
        className="flex min-h-[230px] flex-col gap-2 p-5 md:gap-2"
      >
        <div className="flex gap-2">
          <span
            className={`p-semibold-14 w-min rounded-full ${
              event.is_free ? 'bg-green-100' : 'bg-red-100'
            } px-4 py-1 text-black`}
          >
            {event.is_free ? 'FREE' : `Rp.${event.price}`}
          </span>
          <span
            className={`p-semibold-14 w-min rounded-full ${
              event.is_online ? 'bg-green-100' : 'bg-red-100'
            } px-4 py-1 text-black`}
          >
            {event.is_online ? 'ONLINE' : 'OFFLINE'}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-black">
            {event.category}
          </p>
        </div>
        <p className="p-medium-16 md:p-medium-20 text-black">{event.title}</p>
        <p className="p-medium-14 md:p-medium-16 text-black">
          {formatDate(event.date_time)}
        </p>
        <p className="p-medium-14 md:p-medium-16 line line-clamp-2 flex-1 text-gray-500">
          {event.location}
        </p>
        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">
            {event.organizer}
          </p>
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={() => handleOpenCouponModal(event.id)}
          >
            Coupon
          </button>
          <CouponModal
            isOpen={couponModal}
            onClose={handleCloseCouponModal}
            onSubmit={handleCouponSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizerEvents;
