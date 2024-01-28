'use client';
import CheckoutForm from '@/components/CheckoutForm';
import { useSearchParams } from 'next/navigation';

const formatRupiah = (number) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  });

  return formatter.format(number);
};

const CheckoutPage = () => {
  const searchParam = useSearchParams();
  const totalPrice = searchParam.get('totalPrice');
  const eventId = searchParam.get('eventId');

  // Pastikan nilai-nilai ini bukan undefined sebelum digunakan
  const formattedTotalPrice = totalPrice
    ? formatRupiah(parseFloat(totalPrice))
    : 'Rp 0';
  const formattedEventId = eventId ? eventId : '';

  return (
    <div className="flex flex-col items-center gap-5">
      <h3 className="h3-bold">Checkout Form</h3>
      <CheckoutForm
        totalPrice={formattedTotalPrice}
        eventId={formattedEventId}
      />
    </div>
  );
};

export default CheckoutPage;
