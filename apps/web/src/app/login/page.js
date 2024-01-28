'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login', {
        email: email,
        password: password,
      });
      const { token } = response.data;
      localStorage.setItem('token', token);

      router.push('/');
      if (response.status === 200) {
        console.log('login Success');
      }
    } catch (error) {
      console.error('error facting', error);
    }
  };

  return (
    <div class="flex justify-center h-screen w-screen items-center">
      <div class="w-full md:w-1/2 flex flex-col items-center ">
        {/* <!-- text login --> */}
        <h1 class="text-center text-2xl font-bold text-gray-600 mb-6">LOGIN</h1>
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
            onClick={handleLogin}
            type="button"
            class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"
          >
            {/* {' '} */}
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
