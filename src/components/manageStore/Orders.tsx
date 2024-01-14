import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

const Orders = () => {
  interface Order {
    _id: string;
    code: string;
    purchase_dateTime: string;
    amount: number;
    purchaser: string;
  }

  const [salesAmount, setSalesAmount] = useState<number>()
  const [orders, setOrders] = useState<Order[]>([]);

  const { isLoading, data } = useQuery({
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
    <OrderCard key={order._id} order={order} />
  ));

  useEffect(() => {
    const sales: number = orders?.reduce((prev, current) => {
      return prev + current.amount
    }, 0)
    setSalesAmount(sales)
  }, [orders])
  
  console.log(salesAmount);

  return (
    <div className="flex gap-2">
      {isLoading ? "loading" : 
        (<>
          <div className="flex flex-col p-3 w-[70%] border-4 rounded-lg">
        <div className="title">
          <h2 className="text-success tracking-wider">Invoices</h2>
          <hr />
        </div>
        <div className="tickets flex gap-3 flex-wrap p-3 rounded-lg">
          {isLoading ? "Loading Orders" : renderOrders}
        </div>
      </div>
      <div className="TotalSales w-[30%] rounded-md border-4 p-3 h-max">
        <div className="title">
          <h2 className="text-success">Total Sales</h2>
          <hr />
        </div>
        <h2 className="salesAmount text-lg">
        $ {salesAmount ? salesAmount : 'Calculating Sales'}
        </h2>
      </div>
          </>)
      }
    </div>
  );
};
export default Orders;
