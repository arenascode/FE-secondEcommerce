import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { Product } from "../Products/ProductListContainer";
import CustomerCard from "./UserCard";

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
    name: string;
    email: string;
    profilePhoto: string;
    role: string;
    cart: Product[]
    orders: Order[];
  }

  const [users, SetUsers] = useState<User[]>();

  const CLIENT_URL = useRef<string | null>(null)

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/users", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        SetUsers(res.data.users)
        CLIENT_URL.current = res.data.CLIENT_URL
      });
  }, []);

  //* Render Users 

  const renderUsers = users?.map(user => <CustomerCard User={user} CLIENT_URL={CLIENT_URL.current} key={user._id}/>)

  return <div>{renderUsers}</div>;
}
export default Users