import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import OrderCards from "./OrderCards";

const Orders = () => {
  interface Order {
    _id: string;
    code: string;
    purchase_dateTime: Date;
    amount: number;
    purchaser: string;
  }

  const [orders, setOrders] = useState<Order[]>([
    {
      _id: "",
      code: "",
      purchase_dateTime: new Date(),
      amount: 0,
      purchaser: "",
    },
  ]);

  const { isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      axios
        .get(`http://127.0.0.1:8080/api/orders`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setOrders(res?.data);
          return res.data;
        })
        .catch((error) => console.log(error));
    },
  });

  const renderOrders = orders?.map((order) => (
    <OrderCards Order={order} key={order._id} />
  ));

  return (
    <div className="flex gap-4">
      {isLoading ? "Loading Orders" : renderOrders}
    </div>
  );
};
export default Orders;
