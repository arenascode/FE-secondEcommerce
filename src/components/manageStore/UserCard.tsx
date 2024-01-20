import { Order } from "./Users";
import { Product } from "../Products/ProductListContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";

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
interface Role {
  role: string;
}
const CustomerCard: React.FC<ChildComponentProps> = ({ User, CLIENT_URL }) => {
  const [showRoles, setShowRoles] = useState<boolean>(false);
  const [role, setRole] = useState<string>("");

  const queryClient = useQueryClient();

  const userMutation = useMutation<
    AxiosResponse,
    Error,
    { uid: string; newRole: Role }
  >({
    mutationFn: async ({ uid, newRole }) => {
      console.log(newRole);

      return await axios.put(
        `http://127.0.0.1:8080/api/users/changeUserRoleByAdmin/${uid}`,
        newRole,
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleChangeRole = (event: SelectChangeEvent) => {
    const roleSelected = event.target.value;
    const uid = event.target.name;
    const newRole = {
      role: roleSelected,
    };
    setRole(roleSelected);
    console.log(uid);
    console.log(roleSelected);
    userMutation.mutate({ uid, newRole });
  };

  return (
    <div className="card sm:w-80 bg-base-100 shadow-2xl p-2 bg-gradient-to-tr from-gray-400 at-center to-blue-700 glass">
      <div className="flex gap-2 align-middle Photo&Name">
        <figure className="p-2">
          <img
            src={
              User.profilePhoto
                ? `http://${CLIENT_URL}/${User.profilePhoto}`
                : "/src/assets/user.png"
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
