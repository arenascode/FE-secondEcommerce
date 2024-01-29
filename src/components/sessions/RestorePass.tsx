import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const RestorePass = () => {

  const [email, setEmail] = useState<string | null>(null)
  const [errorMail, setErrorMail] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleRestorePass = async () => {

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== null && !pattern.test(email as string)) {
      setErrorMail(true);
      return;
    }

    await axios.post("http://127.0.0.1:8080/api/sessions/restorePassword/sendMail", {email})
      .then(res => {
        if (res.status === 200) {
          Toast.fire({
            title: res.data,
            icon: "success"
          })
          return <Navigate to={"/login"}/>
        }
      })
      .catch(err => {
        Toast.fire({
          title: err.response.data.message,
          icon: "error"
        })
      });
  }
  
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-8 sm:p-16 md:p-24">
      <div className="backToLoginContainer justify-start align-middle self-start mb-6 flex gap-1 hover:cursor-pointer">
        <ArrowBack />
        <Link to={'/login'} className="">Back To Login</Link>
      </div>
      
      <div className="formContainter">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Restore your password
      </h1>
      <p className="text-base text-gray-600 text-center mb-8">
        Please send your email in order to restore your pass
      </p>
      <form className="w-full max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            placeholder="Email address"
            onChange={(e) => { setEmail(e.target.value); setErrorMail(false)}}
            className="px-4 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring focus:ring-blue-600 focus:ring-opacity-50 w-full"
          />
          {errorMail && (
            <span className="text-sm text-red-400">Invalid eMail Format</span>
          )}
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-600 focus:ring-opacity-50 w-full"
          onClick={handleRestorePass}
        >
          Restore my password
        </button>
      </form>
      </div>
      
    </div>
  );
}
export default RestorePass