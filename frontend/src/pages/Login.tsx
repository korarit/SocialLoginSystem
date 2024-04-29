import { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle , faFacebook , faLine , faGithub } from '@fortawesome/free-brands-svg-icons'


function LoginPage() {

    const [user, setUser] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const login = () => {

        if(user === '' || password === ''){
            alert('กรุณากรอกข้อมูลให้ครบ')
            return
        }

        fetch("http://localhost:3000/login/password", {
            credentials: "include",
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: user,
                password: password
              })
        }).then(async (response) => {
            if (response.status === 200) {
                window.location.reload()
            }else{
                console.log(await response.json());
            }
        })
    }

  return (
    <>
      <div className="flex items-center justify-center h-screen w-screen">

        <div className='h-fit w-[30%] drop-shadow-md shadow-black/20 rounded-2xl bg-slate-50 p-8'>

          <p className='text-center mt-4 text-3xl font-bold'>Login</p>

          <input type='text' placeholder='Username' onChange={e => setUser(e.target.value)} className='w-full mt-12 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <input type='password' placeholder='Password' onChange={e => setPassword(e.target.value)} className='w-full mt-8 p-2 text-xl rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500' />

          <div className='w-full flex space-x-2 mt-12'>
            <button onClick={login} className='bg-blue-500 w-1/2 rounded-xl border-4 border-blue-500 py-2 text-xl font-bold text-white text-center hover:border-blue-600 hover:bg-blue-600 '>
              SING IN
            </button>

            <Link to='/register' className=' w-1/2 rounded-xl border-4 border-green-600 py-2 text-xl font-bold text-black text-center hover:bg-green-600 hover:text-white'>
              SING UP
            </Link>
          </div>

          <p className='text-center mt-8 text-2xl font-bold'>OR LOGIN WITH</p>

          <div className='mx-auto w-fit h-[72px] flex space-x-6 my-8'>
            <button title='google-login' className='w-[72px] rounded-full text-5xl font-bold text-white text-center bg-slate-300 drop-shadow-md shadow-black  hover:text-white hover:bg-gray-800'>
              <FontAwesomeIcon icon={faGoogle} />
            </button>
            <button title='facebook-login' className='w-[72px] rounded-full text-5xl font-bold text-blue-600 text-center bg-slate-300 drop-shadow-md shadow-black  hover:text-white hover:bg-gray-800'>
              <FontAwesomeIcon icon={faFacebook} />
            </button>
            <button title='line-login' className='w-[72px] rounded-full text-5xl font-bold text-green-600 text-center bg-slate-300 drop-shadow-md shadow-black  hover:text-white hover:bg-gray-800'>
              <FontAwesomeIcon icon={faLine} />
            </button>
            <button title='github-login' className='w-[72px] rounded-full text-5xl font-bold text-black text-center  bg-slate-300 drop-shadow-md shadow-black  hover:text-white hover:bg-gray-800'>
              <FontAwesomeIcon icon={faGithub} />
            </button>
          </div>
        </div>

      </div>
    </>
  )
}

export default LoginPage
