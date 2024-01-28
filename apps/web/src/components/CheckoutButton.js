'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const CheckoutButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
  const [totalTicket, setTotalTicket] = useState(0);
  const [data, setData] = useState(null);
  const params = useParams();
  const router = useRouter();

  const eventId = params.id;

  useEffect(() => {
    const fetchCheckoutInfo = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch informasi checkout dari backend
        const res = await fetch(`http://localhost:8000/checkout/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const fetchedData = await res.json();
        setData(fetchedData); // Store the fetched data in state
        setTotalPrice(fetchedData.price);
      } catch (error) {
        console.error('Error fetching checkout information:', error.message);
      }
    };

    if (checkoutClicked) {
      fetchCheckoutInfo();
    }
  }, [checkoutClicked, eventId]);

  const handleIncrement = () => {
    setTotalTicket(totalTicket + 1);
    updateTotalPrice(totalTicket + 1);
  };

  const handleDecrement = () => {
    if (totalTicket > 1) {
      setTotalTicket(totalTicket - 1);
      updateTotalPrice(totalTicket - 1);
    }
  };

  const updateTotalPrice = (newTotalTicket) => {
    const newTotalPrice = data ? data.eventPrice * newTotalTicket : 0;
    setTotalPrice(newTotalPrice);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsModalOpen(true);
      setCheckoutClicked(true);
    } else {
      router.push('/auth/login');
    }
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
    } else {
      // Redirect ke halaman checkout dengan membawa nilai totalPrice dan eventId
      router.push(
        `/events/checkout?totalPrice=${totalPrice}&eventId=${params.id}&totalTicket=${totalTicket}`,
      );
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Tombol Checkout */}
      <button
        onClick={handleCheckout}
        className="bg-red-500 text-white p-2 rounded-md"
      >
        Checkout
      </button>

      {/* Modal Checkout */}
      {isModalOpen && (
        <div className={'modal flex '}>
          <div className="modal-overlay" onClick={handleClose}></div>
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="text-xl font-semibold">Checkout</h3>
              <button className="close-button" onClick={handleClose}>
                &times;
              </button>
            </div>
            <form>
              <div className="modal-content">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center gap-1">
                    <h3 className="text-xl">Total Ticket:</h3>
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="px-2 py-1 border bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={totalTicket}
                      readOnly
                      className="shadow appearance-none border rounded w-10 text-gray-700 focus:outline-none focus:shadow-outline h-10 text-center"
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="px-2 py-1 border bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <h3 className="text-xl">Total Price:</h3>
                    <h3 className="text-xl">{totalPrice}</h3>
                  </div>
                </div>
                <div className="pt-5">
                  <button
                    className="bg-red-500 text-white p-2 rounded-md"
                    type="button"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutButton;
