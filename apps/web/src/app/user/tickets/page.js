import { FilterTicket } from '@/components/FilterTicket';

const ticketUser = () => {
  return (
    <div className="wrapper flex flex-col gap-5">
      <h1 className="h1-bold">My Tickets</h1>
      <FilterTicket />
    </div>
  );
};

export default ticketUser;
