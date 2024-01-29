'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Formik, Form, ErrorMessage, Field, useFormik } from 'formik';
import * as Yup from 'yup';

export default function RegisterPage() {
  const [user_name, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referral_code, setreferral] = useState('');
  const [role, setRole] = useState('');

  const router = useRouter();
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/register', {
        user_name: user_name,
        email: email,
        password: password,
        referral_code: referral_code,
        role: role,
      });

      router.push('/login');
      if (response.status === 200) {
        console.log('register Success');
      }
    } catch (error) {
      console.error('error facting', error);
    }
  };

  const registerSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be 6 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
        'Password should contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
      )
      .required('Password is Required'),
  });

  return (
    <div class="flex justify-center h-screen w-screen items-center">
      <div class="w-full md:w-1/2 flex flex-col items-center ">
        {/* <!-- text register --> */}
        <h1 class="text-center text-2xl font-bold text-gray-600 mb-6">
          Register
        </h1>
        {/* <!-- username input --> */}
        <div class="w-3/4 mb-6">
          <input
            value={user_name}
            type="user_name"
            name="username"
            id="user_name"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {/* <!-- email input --> */}
        <div class="w-3/4 mb-6">
          <input
            value={email}
            type="email"
            name="email"
            id="email"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* <!-- password input --> */}
        <div class="w-3/4 mb-6">
          <input
            value={password}
            type="password"
            name="password"
            id="password"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500 "
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* <!-- referral Code --> */}
        <div class="w-3/4 mb-6">
          <input
            value={referral_code}
            type="referral_code"
            name="referral code"
            id="referral_code"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="referral code"
            onChange={(e) => setreferral(e.target.value)}
          />
        </div>
        {/* <!-- Role input --> */}
        <div class="w-3/4 mb-6">
          <input
            value={role}
            type="role"
            name="role"
            id="role"
            class="w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500"
            placeholder="role"
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        {/* <!-- remember input --> */}
        <div class="w-3/4 flex flex-row justify-between">
          <div class=" flex items-center gap-x-1">
            <input type="checkbox" name="remember" id="" class=" w-4 h-4  " />
            <label for="" class="text-sm text-slate-400">
              Remember me
            </label>
          </div>
          <div>
            {/* <a href="#" class="text-sm text-slate-400 hover:text-blue-500">
              Forgot?
            </a> */}
          </div>
        </div>
        {/* <!-- button --> */}
        <div class="w-3/4 mt-4">
          <button
            onClick={handleRegister}
            type="button"
            class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"
          >
            {/* {' '} */}
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
