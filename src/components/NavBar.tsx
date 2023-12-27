import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useState } from "react";
import { useSessions } from "./context/SessionsContext";

const NavBar = () => {
  const { cartQuantity, cartIdStorage, cartList, subTotal } = useCart();
  const { pathPhoto, isUserLogged, CLIENT_URL, logOut, userHasPhoto } =
    useSessions();
  console.log(CLIENT_URL);
  console.log(isUserLogged && userHasPhoto);

  console.log(cartIdStorage);
  console.log(cartList);

  const handleLogOut = () => {
    logOut();
  };

  const [isDropdownVisible, setIsDropDownVisible] = useState(false);

  const toggleDropdown = async () => {
    setIsDropDownVisible(!isDropdownVisible);
  };

  const closeDropdown = () => {
    setTimeout(() => {
      setIsDropDownVisible(false);
    }, 30);
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-xl fixed z-10 sm:text-2xl">
        <div className="navbar-start">
          <div className="dropdown" /*onBlur={closeDropdown}*/>
            <label
              onClick={toggleDropdown}
              tabIndex={0}
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:h-8 md:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            {/* from here */}
            {isDropdownVisible && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 md:text-lg"
              >
                <li>
                  <Link to={"/"} className="md:text-lg" onClick={closeDropdown}>
                    Home
                  </Link>
                </li>

                <li className="md:text-lg">
                  <Link to={"/products"} onClick={closeDropdown}>
                    Meet our motorcycles
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/profile"}
                    className="md:text-lg"
                    onClick={closeDropdown}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/cartDetail/`}
                    className="md:text-lg"
                    onClick={closeDropdown}
                  >
                    Cart
                  </Link>
                </li>
              </ul>
            )}

            {/* to here */}
          </div>
        </div>
        <div className="navbar-center">
          <Link
            to={"/"}
            className="btn btn-ghost normal-case text-xl md:text-2xl"
          >
            Luxury Motorcycles
          </Link>
        </div>
        <div className="navbar-end gap-3 md:gap-5">
          <div /*onBlur={closeDropdown}*/ className="dropdown dropdown-end">
            <label
              onClick={toggleDropdown}
              tabIndex={0}
              className="btn btn-ghost btn-circle h-8"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="badge badge-m indicator-item">
                  {isUserLogged ? cartQuantity() : 0}
                </span>
              </div>
            </label>
            {/* //* from here */}
            {isDropdownVisible && (
              <div
                tabIndex={0}
                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg">
                    {isUserLogged ? cartQuantity() : 0} Items
                  </span>
                  <span className="text-info">
                    Subtotal: ${isUserLogged ? subTotal : 0}
                  </span>
                  <div className="card-actions">
                    <Link to={`/cartDetail/`}>
                      <button
                        onClick={closeDropdown}
                        className="btn btn-success text-md tracking-widest"
                      >
                        View cart
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {/* //* to here */}
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full md:w-10">
                {pathPhoto && typeof pathPhoto === "string" ? (
                  <img
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "src/assets/user.png"
                    }
                  />
                ) : (
                  <img
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "/src/assets/user.png"
                    }
                  />
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {isUserLogged ? (
                ""
              ) : (
                <li>
                  <Link to={"/login"} className="justify-between md:text-lg">
                    Login
                    {/* <span className="badge">New</span> */}
                  </Link>
                </li>
              )}

              <li>
                <Link to={"/profile"} className="md:text-lg">
                  Profile
                </Link>
              </li>
              {isUserLogged ? (
                <li>
                  <a onClick={() => handleLogOut()} className="md:text-lg">
                    Logout
                  </a>
                </li>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
