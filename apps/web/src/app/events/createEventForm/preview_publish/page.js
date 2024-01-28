import Image from 'next/image';

const PreviewPublish = () => {
  return (
    <div className="wrapper">
      <div className="flex flex-col items-center">
        <h1 className="h1-bold">PREVIEW</h1>
        <div
          className=" w-full flex flex-col md:flex-row mt-6 overflow-hidden rounded-xl
     bg-white shadow-md p-2 border"
        >
          <div className="flex justify-end  ">
            <Image
              src="/assets/images/hero.png"
              alt="eventimg"
              height={350}
              width={350}
              className="w-auto h-auto"
            />
          </div>
          <div className="w-full text-2xl font-light flex flex-col pl-10 gap-5 pt-10">
            <p>Nama Event</p>
            <p>DATE TIME EVENT</p>
            <p>VENUE EVENT</p>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex items-center">
                <Image
                  src="/assets/icons/ticket.svg"
                  alt="pricelogo"
                  width={30}
                  height={30}
                />
                <p>Rp.1000</p>
              </div>
              <div className="flex items-center">
                <Image
                  src="/assets/icons/seat.svg"
                  alt="pricelogo"
                  width={30}
                  height={30}
                />
                <p>300</p>
              </div>
            </div>
            <p className="pt-2">DESCRIPTION</p>
          </div>
        </div>
      </div>
      <div className="pt-6 flex justify-end">
        <button className="bg-black text-white text-xl rounded-lg p-3 ">
          Publish Event
        </button>
      </div>
    </div>
  );
};

export default PreviewPublish;
