import axios from "axios";
import { useRef, useState } from "react"
import { Product } from "../Products/ProductListContainer";
import CustomerCard from "./UserCard";
import { useQuery } from "@tanstack/react-query";
import { useSessions } from "../context/SessionsContext";

export interface Order {

    id: string;
    date: Date;
    products: Product[];
    totalPrice: number;
    status: string;
  }
const Users = () => {
  
  interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    profilePhoto: string;
    role: string;
    last_connection: string;
    cart: {products: Product[], _id: string};
    orders: Order[];
  }
  
  const {setIsUserLogged} = useSessions()
  const [users, SetUsers] = useState<User[]>();

  const CLIENT_URL = useRef<string | null>(null)

  const { isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      axios.get(`http://127.0.0.1:8080/api/users`, {
        withCredentials: true
      }).then((res) => {
        console.log(res);
        CLIENT_URL.current = res.data.CLIENT_URL;
        SetUsers(res.data.users)
        // return res.data.users
      }).catch((err) => {
        console.log(err);
        setIsUserLogged(false)
      })
    }
  })
  console.log({isLoading});
  
  //* Render Users 

  const renderUsers = users?.map(user => <CustomerCard User={user} CLIENT_URL={CLIENT_URL.current} key={user._id}/>)

  const LoadingUsers = () => {
    return (
      <div className="h-screen flex justify-center pt-24 gap-2 tracking-wider text-gray-200 text-xl md:text-2xl lg:text-3xl">
        <h1>Loading Users</h1>
        <div>
          <span className="loading loading-spinner loading-xs"></span>
          <span className="loading loading-spinner loading-sm"></span>
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-4 sm:flex-col place-content-center sm:p-6 md:flex-row md:flex-wrap md:gap-10 lg:gap-14">{isLoading ? <LoadingUsers/> : renderUsers}
    </div>);
}
export default Users