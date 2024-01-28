import { fetchCategories } from '@/app/lib/api';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const createEventForm = () => {
  const [category, setCategory] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [image, setImage] = useState(null);
  const [errorImage, setErrorImage] = useState(false);
  const route = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setImage(e.target.files[0]);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCategories();
        setCategory(data);
      } catch (error) {
        console.error('Error in component:', error);
      }
    };

    fetchData();
  }, []);

  const handleOnline = () => {
    return setIsOnline(true);
  };

  const handleVenue = () => {
    return setIsOnline(false);
  };

  const handleFree = () => {
    return setIsFree(true);
  };

  const handlePrice = () => {
    return setIsFree(false);
  };

  const initialValues = {
    title: '',
    organizer: '',
    category: '',
    description: '',
    alamat: {
      input: '',
      select: '',
    },
    dateTime: '',
    endTime: '',
    price: 0,
    seats: 0,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('title is required'),
    organizer: Yup.string().required('organizer is required'),
    category: Yup.string().required('cateogry is required'),
    description: Yup.string().required('Description is required'),
    dateTime: Yup.string().required('Start Date is required'),
    endTime: Yup.string().required('End Date is required'),
    price: Yup.string().required('price is required'),
    seats: Yup.string().required('seats is required'),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    if (!image) {
      setErrorImage(true);
      setSubmitting(false);
      return;
    }
    setErrorImage(false);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    //menambah zona lokal
    const dateTime = new Date(values.dateTime);
    const formattedDateTime = dateTime.toString();
    const endTime = new Date(values.endTime);
    const formattedendTime = endTime.toString();

    //mengolah location
    const locationFromFrontend = values.alamat;
    const formattedLocation = `${locationFromFrontend.input},${locationFromFrontend.select}`;

    formData.append('is_online', isOnline);
    formData.append('is_free', isFree);
    formData.append('location', formattedLocation);
    formData.append('date_time', formattedDateTime);
    formData.append('end_time', formattedendTime);

    formData.append('image', image);
    console.log([...formData]);
    console.log(formattedLocation);

    try {
      const response = await axios.post(
        'http://localhost:8000/event/createEvent',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
      console.log('Response from server:', response.data);
      alert('Data berhasil disubmit!');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
    route.push('/');
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="w-full px-5 justify-center md:justify-between md:p-0 md:max-w-4xl mx-auto flex flex-row md:flex-col">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <Field
              type="text"
              id="title"
              name="title"
              className="shadow appearance-none border rounded w-full text-gray-700 focus:outline-none focus:shadow-outline h-10 "
              placeholder="TITLE"
            />
            <ErrorMessage
              name="title"
              component="p"
              className="text-red-500 text-xs italic"
            />
          </div>
          <div className="flex flex-col">
            <Field
              type="text"
              id="organizer"
              name="organizer"
              className="shadow appearance-none border rounded w-full text-gray-700 focus:outline-none focus:shadow-outline h-10"
              placeholder="ORGANIZER"
            />
            <ErrorMessage
              name="organizer"
              component="p"
              className="text-red-500 text-xs italic"
            />
          </div>
          <div className="flex flex-col">
            <Field
              as="select"
              id="category"
              name="category"
              className="shadow appearance-none border rounded w-full text-gray-700 focus:outline-none focus:shadow-outline h-10"
            >
              <option value="" disabled>
                Pilih Kategori
              </option>
              {category.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="category"
              component="p"
              className="text-red-500 text-xs italic"
            />
          </div>
          <div className="flex flex-col">
            <Field
              as="textarea"
              id="description"
              name="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
              placeholder="Enter description"
            />
            <ErrorMessage
              name="description"
              component="p"
              className="text-red-500 text-xs italic mt-1"
            />
          </div>
          <div className="flex flex-row space-x-2">
            <button
              onClick={handleVenue}
              className="bg-black text-white p-2 rounded-md "
              type="button"
            >
              VENUE
            </button>
            <button
              onClick={handleOnline}
              className="bg-black text-white p-2  rounded-md"
              type="button"
            >
              ONLINE
            </button>
          </div>
          {!isOnline && (
            <div className="flex flex-col md:flex-row justify-between gap-1">
              <div className="flex flex-col w-1/2">
                <Field
                  type="text"
                  id="alamat.input"
                  name="alamat.input"
                  className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
                  placeholder="Enter location (input)"
                />
                <ErrorMessage
                  name="alamat.input"
                  component="p"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>
              <div className="flex flex-col w-1/2">
                <Field
                  as="select"
                  id="alamat.select"
                  name="alamat.select"
                  className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
                >
                  <option value="">Select location</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                </Field>
                <ErrorMessage
                  name="alamat.select"
                  component="p"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-1">
            <div className="flex flex-col w-1/2">
              <label>Start Date:</label>
              <Field
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
              />
              <ErrorMessage
                name="dateTime"
                component="p"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label>End Date:</label>
              <Field
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
              />
              <ErrorMessage
                name="endTime"
                component="p"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            {!previewImage && (
              <div className=" h-40 border-dashed border-2 border-b-0 border-gray-300 bg-gray-100" />
            )}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className=" max-h-80 max-w-80 "
              />
            )}
            <label>Image:</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => {
                handleImageChange(e);
              }}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
            />
            {errorImage && (
              <p className="text-red-500 text-xs italic mt-1">image required</p>
            )}
            {/* <ErrorMessage
              name="image"
              component="p"
              className="text-red-500 text-xs italic mt-1"
            /> */}
          </div>
          <div className="flex flex-row space-x-2">
            <button
              onClick={handlePrice}
              className="bg-black text-white p-2 rounded-md "
              type="button"
            >
              Paid
            </button>
            <button
              onClick={handleFree}
              className="bg-black text-white p-2  rounded-md"
              type="button"
            >
              Free
            </button>
          </div>
          {!isFree && (
            <div className="flex flex-col w-full">
              <label>Price:</label>
              <Field
                type="number"
                id="price"
                name="price"
                className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
                placeholder="Input Price"
              />
              <ErrorMessage
                name="price"
                component="p"
                className="text-red-500 text-xs italic mt-1"
              />
            </div>
          )}
          <div className="flex flex-col w-full">
            <label>Seats:</label>
            <Field
              type="number"
              id="seats"
              name="seats"
              className="shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-10"
              placeholder="Total Seats"
            />
            <ErrorMessage
              name="seats"
              component="p"
              className="text-red-500 text-xs italic mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-black hover:bg-black-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-10"
          >
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default createEventForm;
