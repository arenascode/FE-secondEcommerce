import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineArrowRight, AiOutlineGithub } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSessions } from "../context/SessionsContext";
import { ProductCart, useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [email, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rerender, setRerender] = useState(false);
  const [lockButton, setLockButton] = useState(true);
  const [errorMail, setErrorMail] = useState(false);

  const {
    setPathPhoto,
    setIsUserLogged,
    pathToRedirect,
    setPathToRedirect,
    setUserHasPhoto,
    isUserLogged,
  } = useSessions();

  const { getCartById, setCartList, subTotalProducts, setCartIdStorage } =
    useCart();
  const { setProfileData } = useSessions();
  const CLIENT_URL = useRef<string | null>(null);

  interface ResponseType {
    access_token?: string;
    expires_in?: number;
    refresh_token?: number;
    refresh_token_expires_in?: number;
    scope?: string;
    token_type?: string;
  }

  async function getAccessToken(codeParam: string) {
    const response = await axios.get<ResponseType>(
      `http://127.0.0.1:8080/api/sessions/getGhToken?code=${codeParam}`
    );
    const data = response.data;
    console.log(data);
    if (data?.access_token) {
      localStorage.setItem("accessToken", data?.access_token);
      setRerender(!rerender);
      Toast.fire({
        icon: "success",
        title: "Welcome to Luxury Motorcycles",
      });
    }

    setTimeout(() => {
      getUserData();
    }, 2000);
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && localStorage.getItem("accessToken") === null) {
      getAccessToken(codeParam);
    }
  }, [isUserLogged]);

  async function getUserData() {
    await fetch(`http://127.0.0.1:8080/api/sessions/getGhUser`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const photoPath = data.profilePhoto;

        if (photoPath) {
          // CLIENT_URL.current = result.data.CLIENT_URL;
          setUserHasPhoto(true);
          setPathPhoto(photoPath);
          setIsUserLogged(true);
        }

        setIsUserLogged(true);
      });
  }

  const githubLogin = async () => {
    const clientID = "Iv1.ed2c377f76d4b2ca";
    window.location.href = `https://github.com/login/oauth/authorize?scope=user&client_id=${clientID}`;
  };

  const userCredentials = {
    email,
    password,
  };
  /**Sweet Alert */
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

  const userLogin = async () => {
    console.log(userCredentials);

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== null && !pattern.test(email as string)) {
      setErrorMail(true);
      return;
    }
    await axios
      .post("http://127.0.0.1:8080/api/sessions/login", userCredentials, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (result) => {
        if (result.status === 200) {
          const photoPath = result.data.loggedUserDto.profilePhoto;

          if (photoPath) {
            console.log(`The user has have profilePicture`);
            const staticWord = "static";
            const trimmingPath = photoPath.slice(6);
            const newPath = staticWord + trimmingPath;
            CLIENT_URL.current = result.data.CLIENT_URL;
            setPathPhoto(`http://${CLIENT_URL.current}/${newPath}`);
            setUserHasPhoto(true);
          }
          Toast.fire({
            icon: "success",
            title: `Welcome to Luxury Motorcycles`,
          });
          setIsUserLogged(true);
          setProfileData(result.data.loggedUserDto);

          if (result.data.loggedUserDto.cartId !== "") {
            setCartIdStorage(result.data.loggedUserDto.cartId);
            const cartSaved: ProductCart[] | string | unknown =
              await getCartById(result.data.loggedUserDto.cartId);

            if (Array.isArray(cartSaved)) {
              setCartList(cartSaved);
              subTotalProducts(cartSaved);
            } else if (typeof cartSaved === "string") {
              console.error("Error fetching cart:", cartSaved);
            } else if (cartSaved == null) {
              console.error("Unexpected type for cartSaved:", cartSaved);
            }
          }

          setTimeout(() => {
            window.location.replace(pathToRedirect);
            setPathToRedirect("/");
          }, 1000);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Toast.fire({
            icon: "error",
            title: `invalid Data. Try Again`,
          });
        } else if (err.response.status === 404) {
          Toast.fire({
            icon: "error",
            title: `invalid credentials. Try Again`,
          });
        }
      });
  };

  useEffect(() => {
    const isLockedButton =
      email == null || email == "" || password == null || password == "";
    isLockedButton ? setLockButton(true) : setLockButton(false);
    setErrorMail(false);
  }, [email, password]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      userLogin();
    }
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
          <form className="rounded-md shadow-sm" onKeyDown={handleKeyDown}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                  setErrorMail(false);
                }}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm font-[sans-serif] md:text-md tracking-wide font-semibold placeholder:font-bebas"
                placeholder="Your E-Mail"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm placeholder:tracking-wider"
                placeholder="Password"
              />
              {errorMail && (
                <span className="text-sm text-red-400">
                  Invalid eMail Format
                </span>
              )}
            </div>
          </form>
          <div className="flex items-end justify-between">
            <div className="text-black self-start flex flex-col">
              <span className="text-sm self-start">Forgot your password?</span>
              <Link to={"/restorePass"} className="w-max">
                <button className="btn btn-xs">Restore it!</button>
              </Link>
            </div>

            <button
              onClick={userLogin}
              disabled={lockButton}
              className={` ${
                lockButton && "disabled:text-gray-400 disabled:bg-gray-300"
              } w-1/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 tracking-wider`}
            >
              Login
            </button>
          </div>
        </div>
        <div className="signWithGH flex flex-col justify-center gap-2 m-auto items-center ">
          <h3>Or Sign With Github</h3>
          <div
            onClick={githubLogin}
            className=" flex justify-center text-4xl text-black tracking-wider shadow-lg rounded-full hover:cursor-pointer"
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
