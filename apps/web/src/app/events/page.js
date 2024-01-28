import Link from 'next/link';

async function getProduct() {
  const res = await fetch('http://localhost:8000/event/discovery');
  const data = await res.json();
  return data;
}

export default async function Products() {
  const products = await getProduct();

  return (
    <>
      {/* Menggunakan map untuk membuat elemen Link untuk setiap objek */}
      {products.map((product) => (
        <Link key={product.id} href={`/events/${product.id}`}>
          <h1>{product.title}</h1>
        </Link>
      ))}
    </>
  );
}
