import axios from "axios";
import { useRef, useState } from "react"
import { Product } from "../Products/ProductListContainer";
import CustomerCard from "./UserCard";
import { useQuery } from "@tanstack/react-query";

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
      })
    }
  })
  
  //* Render Users 

  const renderUsers = users?.map(user => <CustomerCard User={user} CLIENT_URL={CLIENT_URL.current} key={user._id}/>)

  return (
    <div className="flex gap-4">{isLoading ? "Loading Users" : renderUsers}</div>);
}
export default Users