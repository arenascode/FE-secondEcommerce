import axios from "axios";
import React, { useRef, useState } from "react";
import { AiOutlineArrowRight, AiOutlineGithub } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSessions } from "../context/SessionsContext";
import { useCart } from "../context/CartContext";

const Login: React.FC = () => {
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setPathPhoto, setIsUserLogged, pathToRedirect, setPathToRedirect } = useSessions()
  
  const {getCartById, setCartList} = useCart()
  
  // const [CLIENT_URL, setCLIENT_URL] = useState<string>('')
  const CLIENT_URL = useRef<string | null>(null);
  const githubLogin = () => {
    const clientID = `<YOUR_CLIENT_ID>`;
    window.location.href = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientID}`;
  };

  const userCredentials = {
    email,
    password,
  };

  const userLogin = async () => {
    console.log(userCredentials);

    await axios.post(
      "http://127.0.0.1:8080/api/sessions/login", userCredentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          }
      }
    ).then(async (result) => {
      console.log(result);
      if (result.status === 200) {
        alert(`Welcome to Luxury Motorcycles`);
        const photoPath = result.data.loggedUserDto.profilePhoto;

        const staticWord = "static";
        const trimmingPath = photoPath.slice(6);
        const newPath = staticWord + trimmingPath;
        console.log(`new path ${newPath}`);
        CLIENT_URL.current= result.data.CLIENT_URL
        setPathPhoto(`http://${CLIENT_URL.current}/${newPath}`);
        console.log(CLIENT_URL);
        
        setIsUserLogged(true)
        console.log(`currentLocation in Login ${pathToRedirect}`);
        
        window.location.replace(pathToRedirect);
        setPathToRedirect('/')
        const cartSaved = await getCartById()
        setCartList(cartSaved)
      }
    })
      .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
          alert("invalid Data. Try Again");
        } else if (err.response.status === 404) {
          alert("invalid credentials. Try Again");
        }
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome !
          </h2>
        </div>
        <div className="mt-8 space-y-6 text-white">
          <input type="hidden" name="remember" value="true" />
          <form className="rounded-md shadow-sm">
            <div>
              <input
                type="text"
                value={email}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your E-Mail"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </form>
          <div className="flex items-end justify-end">
            <button
              onClick={userLogin}
              className="w-1/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 tracking-wider"
            >
              Login
            </button>
          </div>
        </div>
        <div className="signWithGH flex flex-col justify-center gap-2 m-auto items-center ">
          <h3>Or Sign With Github</h3>
          <div
            onClick={githubLogin}
            className=" flex justify-center text-4xl text-black tracking-wider shadow-lg rounded-full"
          >
            <AiOutlineGithub />
          </div>
        </div>
        <div className="linkToRegister flex justify-center gap-4 m-auto items-center ">
          <h3>Be member of our comunity</h3>
          <AiOutlineArrowRight />
          <Link to={"/register"}>
            <button className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 tracking-wider">
            Create Your Account
          </button>
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
