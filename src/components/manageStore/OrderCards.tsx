
interface ChildComponentProps {
  Order: {
    _id: string
    code: string
    purchase_dateTime: Date
    amount: number,
    purcharser: string
  }
}
const OrderCards:React.FC<ChildComponentProps> = ({Order}) => {

  return (
    <div className="card w-96 bg-primary text-primary-content">
      <div className="card-body">
        <h4 className="card-title">Code: {Order.code}</h4>
        <span>Amount: </span><p>{Order.amount}</p>
        <div className="card-actions justify-end">
          <button className="btn">Buy Now</button>
        </div>
      </div>
    </div>
  );
}
export default OrderCards