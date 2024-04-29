import { useState } from 'react'
import { Link , useNavigate  } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';


interface RegisterData {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

function Register() {

  
  const [registerData, setDataRegister] = useState<RegisterData>({
    username: '',
    password: '',
    firstname: '',
    lastname: ''
  });

  const setData = (key: string, value: string) => {
    setDataRegister({
      ...registerData,
      [key]: value
    })
  }

  const navigate = useNavigate();
  const register = () => {

    if(registerData.username === '' || registerData.password === '' || registerData.firstname === '' || registerData.lastname === ''){
      alert('กรุณากรอกข้อมูลให้ครบ')
      return
    }

    console.log(JSON.stringify(registerData));

    fetch("http://localhost:3000/signup", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

      },
      body: JSON.stringify(registerData)
    }).then((response) => {
        if (response.status === 200) {
          navigate('/')
        }
        throw new Error("register has been failed!");
      })
      .then((resObject) => {
        console.log(resObject);
      })
      .catch((err) => {
        console.log(err);
    })

  }

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen">

        <div className='h-fit w-[30%] drop-shadow-md shadow-black/20 rounded-2xl bg-slate-50 p-8'>

          <p className='text-center mt-4 text-3xl font-bold'>Register</p>

          <input type='text' placeholder='Username' onChange={e => setData('username', e.target.value)} className='w-full mt-12 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='text' placeholder='ชื่อจริง' onChange={e => setData('firstname', e.target.value)} className='w-full mt-8 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='text' placeholder='นามสกุล' onChange={e => setData('lastname', e.target.value)} className='w-full mt-8 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='password' placeholder='Password' onChange={e => setData('password', e.target.value)} className='w-full mt-8 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <PasswordStrengthBar password={registerData.password} className='mt-4 text-xl font-bold' />


          <div className='w-full flex space-x-2 mt-12'>
            <button onClick={register} className='bg-blue-500 w-1/2 rounded-xl border-4 border-blue-500 py-2 text-xl font-bold text-white text-center hover:border-blue-600 hover:bg-blue-600 '>
              REGISTER
            </button>

            <Link  to='/' className=' w-1/2 rounded-xl border-4 border-red-600 py-2 text-xl font-bold text-black text-center  hover:bg-red-600 hover:text-white'>
              CANCEL
            </Link >
          </div>


        </div>

      </div>
    </>
  )
}

export default Register
