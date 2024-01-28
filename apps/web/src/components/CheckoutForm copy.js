'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

const CheckoutFormcopy = () => {
  const [eventPrice, setEventPrice] = useState(null);
  const [coupon, setCoupons] = useState([]);
  const [points, setPoints] = useState(0);
  const [isPointsUsed, setIsPointsUsed] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutClicked, setCheckoutClicked] = useState(false);
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

        const data = await res.json();

        // Update state dengan informasi dari backend
        setEventPrice(data.eventPrice);
        setCoupons(data.eventCoupons);
        setPoints(data.userPoints);
        setTotalPrice(data.eventPrice);
      } catch (error) {
        console.error('Error fetching checkout information:', error.message);
      }
    };

    if (checkoutClicked) {
      fetchCheckoutInfo();
    }
  }, [checkoutClicked, eventId]);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');

    if (token) {
      setIsModalOpen(true);
      setCheckoutClicked(true);
    } else {
      router.push('/auth/login');
    }
  };

  const getCouponId = () => {
    const selectedCoupon = coupon.find((coupon) => coupon.isChecked);
    return selectedCoupon ? selectedCoupon.id : null;
  };

  // Perubahan untuk menangani perubahan status poin
  const handlePointChange = () => {
    setIsPointsUsed((prevIsPointsUsed) => !prevIsPointsUsed);

    if (setIsPointsUsed.isChecked) {
      // Jika dicentang, kurangi totalPrice dengan discountAmount
      setTotalPrice((prevTotalPrice) => parseFloat(prevTotalPrice) + points);
    } else {
      // Jika tidak dicentang, tambahkan totalPrice dengan discountAmount
      setTotalPrice((prevTotalPrice) => parseFloat(prevTotalPrice) - points);
    }
    setIsPointsUsed.isChecked = !setIsPointsUsed.isChecked;
  };

  const handleConfirm = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // Menggunakan axios untuk mengirim data transaksi ke backend
      const response = await axios.post(
        `http://localhost:8000/checkout/${eventId}`,
        {
          couponId: getCouponId(),
          pointUsed: isPointsUsed ? points : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Jika transaksi berhasil, kembali ke halaman utama
      router.push('/');
    } catch (error) {
      console.error('Error during transaction:', error.message);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handlecouponChange = (couponId) => {
    // Cari kupon berdasarkan couponId
    const selectedCoupon = coupon.find((coupon) => coupon.id === couponId);

    if (selectedCoupon) {
      const discountAmount = parseFloat(selectedCoupon.discount_amount);

      // Periksa apakah checkbox dicentang atau tidak
      if (selectedCoupon.isChecked) {
        // Jika dicentang, kurangi totalPrice dengan discountAmount
        setTotalPrice(
          (prevTotalPrice) => parseFloat(prevTotalPrice) + discountAmount,
        );
      } else {
        // Jika tidak dicentang, tambahkan totalPrice dengan discountAmount
        setTotalPrice(
          (prevTotalPrice) => parseFloat(prevTotalPrice) - discountAmount,
        );
      }

      // Perbarui isChecked pada kupon yang bersangkutan
      selectedCoupon.isChecked = !selectedCoupon.isChecked;
    }
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
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {/* Tombol Close */}
            <button
              style={closeButtonStyle}
              type="button"
              onClick={handleClose}
            >
              X
            </button>
            <h2>Checkout</h2>
            <form>
              <label>
                Nama:
                <input type="text" />
              </label>
              <br />
              <label>
                Email:
                <input type="email" />
              </label>
              <br />
              {/* Harga */}
              <p>Price: {eventPrice ? `${eventPrice}` : 'Memuat...'}</p>

              {/* Daftar coupon */}
              <div>
                <p>Coupon:</p>
                {coupon.map((coupon) => (
                  <label key={coupon.id}>
                    <div className="flex gap-1">
                      <input
                        type="checkbox"
                        onChange={() => handlecouponChange(coupon.id)}
                      />
                      <p>{coupon.name}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Poin */}
              <div className="gap-1 flex">
                <input type="checkbox" onChange={handlePointChange} />
                <p>{points} Points</p>
              </div>

              {/* Total Harga */}
              <p>Total price: {totalPrice}</p>

              <button
                className="bg-red-500 text-white p-2 rounded-md"
                type="button"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutFormcopy;
