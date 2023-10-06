import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";
import { useState } from "react";

const NavBar = () => {

  const { cartQuantity, subTotalProducts, cartIdStorage } = useCart()

  const [isDropdownVisible, setIsDropDownVisible] = useState(false)

  const toggleDropdown = () => {
    setIsDropDownVisible(!isDropdownVisible)
  }

  const closeDropdown = () => {

    setTimeout(() => {
      setIsDropDownVisible(false)
    }, 30);
  } 
  
  return (
    <>
      <div className="navbar bg-base-100 shadow-xl fixed z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={'/products'}>Meet our motorcycles</Link>
              </li>
              <li>
                <a>Offers</a>
              </li>
              <li>
                <Link to={"/profile"}>Profile</Link>
              </li>
              <li>
                <Link to={`/cartDetail/${cartIdStorage}`}>Cart</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <Link to={"/"} className="btn btn-ghost normal-case text-xl">
            Luxury Motorcycles
          </Link>
        </div>
        <div className="navbar-end gap-3">
          <div onBlur={closeDropdown} className="dropdown dropdown-end ">
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
                  {cartQuantity()}
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
                    {cartQuantity()} Items
                  </span>
                  <span className="text-info">
                    Subtotal: ${subTotalProducts()}
                  </span>
                  <div className="card-actions">
                    <Link to={`/cartDetail/${cartIdStorage}`}>
                      <button
                        onClick={closeDropdown}
                        className="btn btn-primary btn-block"
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
              <div className="w-8 rounded-full">
                <img src="../src/assets/user.png" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/login"} className="justify-between">
                  Login
                  {/* <span className="badge">New</span> */}
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
          {/* <div className="logo">
            <img src="../src/assets/logo.png" alt="" />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default NavBar;
