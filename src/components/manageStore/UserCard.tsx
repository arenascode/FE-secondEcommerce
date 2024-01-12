import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Order } from "./Users";
import { Product } from "../Products/ProductListContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

//*
interface ChildComponentProps {
  User: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    profilePhoto: string;
    role: string
    cart: { products: Product[], _id: string }
    last_connection: string;
    orders: Order[];
  };
  CLIENT_URL: string | null;
}
interface Role {
  role: string;
}
const CustomerCard: React.FC<ChildComponentProps> = ({ User, CLIENT_URL }) => {
  
  const [showRoles, setShowRoles] = useState<boolean>(false)
  const [role, setRole] = useState<string>('')

  const queryClient = useQueryClient();
  
  const userMutation = useMutation<AxiosResponse, Error, { uid: string; newRole: Role }>({
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
        queryClient.invalidateQueries(['users'])
      },
  });
    
  const handleChangeRole = (event: SelectChangeEvent) => {
    const roleSelected = event.target.value;
    const uid = event.target.name
    const newRole = {
      role: roleSelected
    }
    setRole(roleSelected)
    console.log(uid);
    console.log(roleSelected)
    userMutation.mutate({uid,newRole})
  };
  
    return (
      <Card sx={{ maxWidth: 345 }}>
        <div className="flex gap-2 align-middle Photo&Name">
          <CardMedia
            sx={{ height: 80, width: 120, borderRadius: "100%", margin: 0.5 }}
            image={`http://${CLIENT_URL}/${User.profilePhoto}`}
            title="green iguana"
          />
          <div className="userName w-full p-2 pr-3">
            <Typography gutterBottom variant="h6" component="div">
              {User.first_name}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {User.last_name}
            </Typography>
            <hr className="" />
          </div>
          {/* <img src={`http://${CLIENT_URL}/${User.profilePhoto}`} alt="" /> */}
        </div>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <div className="email flex gap-3">
              <span className="w-10">Email:</span>
              <span className="text-black">{User.email}</span>
            </div>
            <div className="Age flex gap-3">
              <span className="w-10">Age:</span>
              <span className="text-black">{User.age}</span>
            </div>
            <div className="Age flex gap-3">
              <span className="w-10">Role:</span>
              <span className="text-black">{User.role}</span>
            </div>
            <div className="Age flex gap-3">
              <span className="w-max">Last Connection:</span>
              <span className="text-black">
                {new Date(User.last_connection).toLocaleString()}
              </span>
            </div>
          </Typography>
        </CardContent>
        <CardActions>
          <Button data-uid={User._id} onClick={() => setShowRoles(!showRoles)}>
            Change Role
          </Button>
          {showRoles && (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Role</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={role}
                label="Role"
                onChange={handleChangeRole}
                name={User._id}
              >
                <MenuItem value={"user"}>User</MenuItem>
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"premium"}>Premium</MenuItem>
              </Select>
            </FormControl>
          )}
          {/* <Button size="small">Learn More</Button> */}
        </CardActions>
      </Card>
    );
};

export default CustomerCard;
