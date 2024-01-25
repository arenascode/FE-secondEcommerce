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

  const [salesAmount, setSalesAmount] = useState<number>();
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
      return prev + current.amount;
    }, 0);
    setSalesAmount(sales);
  }, [orders]);

  console.log(salesAmount);

  return (
    <div className="flex gap-2">
      {isLoading ? (
        "loading"
      ) : (
        <div className="flex sm:flex-col-reverse sm:gap-3 sm:pt-2">
          <div className="flex flex-col p-3 w-[70%] border-4 rounded-lg sm:min-w-full">
            <div className="title flex place-content-center">
              <h2 className="text-gray-200 tracking-wider text-xl md:text-2xl xl:text-3xl">Invoices</h2>
              <hr />
            </div>
            <div className="tickets flex gap-3 flex-wrap p-3 rounded-lg md:gap-8 md:place-content-center">
              {isLoading ? "Loading Orders" : renderOrders}
            </div>
          </div>
          <div className="TotalSales w-[30%] sm:flex items-center gap-3 rounded-md border-4 p-3 h-max sm:w-full sm:flex-row sm:place-content-center text-xl xl:text-2xl">
            <div className="title flex sm:place-content-center tracking-wider">
              <h2 className="text-gray-200">Total Sales</h2>
              <hr />
            </div>
            <h2 className="salesAmount text-success">
              $ {salesAmount ? salesAmount : "Calculating Sales"}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
export default Orders;
