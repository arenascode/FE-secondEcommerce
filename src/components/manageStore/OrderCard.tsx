
interface ChildComponentProps {
  order: {
    _id: string
    code: string
    purchase_dateTime: string
    amount: number,
    purchaser: string
  }
}
const OrderCard:React.FC<ChildComponentProps> = ({order}) => {

  return (
    <div className="card bg-gray-600 text-primary-content h-max w-max p-0">
      <div className="card-body">
        <h4 className="card-title">Invoice: {order.code}</h4>
        <div className="Amount flex gap-2">
          <span>Amount: </span>
          <p>$ {order.amount}</p>
        </div>
        <div className="Purchase Date flex gap-2">
          <span>Purchase Date: </span>
          <p> {new Date(order.purchase_dateTime).toLocaleString()}</p>
        </div>
        <div className="Purchaser flex gap-2">
          <span>Purchaser: </span>
          <p> {order.purchaser}</p>
        </div>
        {/* <div className="card-actions justify-end">
          <button className="btn">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
}
export default OrderCard