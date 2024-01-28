import Link from 'next/link';

export const Navitem = () => {
  return (
    <div className={`flex gap-2 items-center`}>
      <Link href="/events/discovery">
        <button className="p-2 hover:bg-black hover:text-white rounded-md">
          Find Event
        </button>
      </Link>
      <Link href="/events/createEventForm">
        <button className="p-2 hover:bg-black hover:text-white rounded-md">
          Create Event
        </button>
      </Link>
    </div>
  );
};
