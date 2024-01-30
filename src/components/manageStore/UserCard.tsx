import { Order } from "./Users";
import { Product } from "../Products/ProductListContainer";

//*
interface ChildComponentProps {
  User: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    profilePhoto: string;
    role: string;
    cart: { products: Product[]; _id: string };
    last_connection: string;
    orders: Order[];
  };
  CLIENT_URL: string | null;
}

const CustomerCard: React.FC<ChildComponentProps> = ({ User, CLIENT_URL }) => {


  return (
    <div className="card sm:w-80 bg-base-100 shadow-2xl p-2 bg-gradient-to-tr from-gray-400 at-center to-stone-700 glass">
      <div className="flex gap-2 align-middle Photo&Name">
        <figure className="p-2">
          <img
            src={
              User.profilePhoto
                ? `${CLIENT_URL}/${User.profilePhoto}`
                : "/user.png"
            }
            alt="userPhoto"
            className="rounded-xl sm:max-w-[8rem]"
          />
        </figure>
        <div className="name flex sm:flex-col sm:text-2xl p-1 tracking-wide text-gray-200">
          <span>{User.first_name}</span>
          <span>{User.last_name}</span>
        </div>
      </div>
      <hr className="bg-gray-400 h-[1px] border-none" />
      <div className="card-body items-start text-center">
        <div className="email flex gap-1">
          <span className="w-10 flex self-start text-gray-700">Email:</span>
          <span className="text-gray-200">{User.email}</span>
        </div>

        <div className="Age flex gap-1 items-start">
          <span className="w-10 flex self-start text-gray-700">Age:</span>
          <span className="text-gray-200">{User.age}</span>
        </div>

        <div className="Age flex gap-1">
          <span className="w-10 flex self-start text-gray-700">Role:</span>
          <span className="text-gray-200">{User.role}</span>
        </div>

        <div className="Age flex gap-1">
          <span className="w-max flex self-start text-gray-700">
            Last Connection:
          </span>
          <span className="text-gray-200">
            {new Date(User.last_connection).toLocaleString()}
          </span>
        </div>
        <div className="card-actions flex self-center p-3 pb-0">
          <button className="btn btn-accent text-gray-700">View Profile</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
