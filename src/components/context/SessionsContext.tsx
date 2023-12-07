import { ReactNode, createContext, useContext, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
useLocation;

export type PhotoFile = File | null | string | undefined
export type ProfileData = {
  email: string;
  fullName: string;
  role: string;
  id: string;
};

type SessionsContextType = {
  handleConfirmPhoto: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
  profileData: ProfileData | null;
  setIsUserLogged: React.Dispatch<React.SetStateAction<boolean>>;
  isUserLogged: boolean;
  pathPhoto: string;
  setPathPhoto: React.Dispatch<React.SetStateAction<string>>;
  CLIENT_URL: string | null;
  setCLIENT_URL: React.Dispatch<React.SetStateAction<string>>;
  logOut: () => void;
  pathToRedirect: string;
  setPathToRedirect: React.Dispatch<React.SetStateAction<string>>;
  setUserHasPhoto: React.Dispatch<React.SetStateAction<boolean>>
  userHasPhoto: boolean
};

const SessionsContext = createContext<SessionsContextType>({
  handleConfirmPhoto: () => { },
  setProfileData: () => { },
  profileData: null,
  setIsUserLogged: () => { },
  isUserLogged: false,
  pathPhoto: '',
  setPathPhoto: () => { },
  setCLIENT_URL: () => { },
  CLIENT_URL: null,
  logOut: () => { },
  pathToRedirect: '/',
  setPathToRedirect: () => { },
  setUserHasPhoto: () => { },
  userHasPhoto: false
})

export const useSessions = () => {
  return useContext(SessionsContext)
}


//* Current Session
type SessionsContextProviderProps = {
  children: ReactNode
}
const SessionsContextProvider = ({ children }: SessionsContextProviderProps) => {
  
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  //**Register Session */

  //**Login Session */
  const [isUserLogged, setIsUserLogged] = useLocalStorage<boolean>(
    "userLogged",
    false
  );
  console.log(isUserLogged);

  const [CLIENT_URL, setCLIENT_URL] = useLocalStorage<string>("CLIENT_URL", "");

  //**To Save the Actual User Location */
  const [pathToRedirect, setPathToRedirect] = useLocalStorage<string>("lastLocation", '/');
  console.log(pathToRedirect);
  
  //* Current Session */

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [pathPhoto, setPathPhoto] = useLocalStorage<string>(
    "profilePic",
    "notRefresh"
  );
  const [userHasPhoto, setUserHasPhoto] = useLocalStorage<boolean>('userHasPhoto', false)
  const handleConfirmPhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.userId);
    console.log(`hii!!`);

    // axios.put(`http://127.0.0.1:8080/api/users/${profileData?.id}`)
    //   .then((res) => {
    //     console.log(res);
    //     setProfilePhotoUrl(res.data.profilePhoto)

    // })
  };

  //**Log Out function */

  const logOut = () => {
    axios
      .get(`http://127.0.0.1:8080/api/sessions/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) {
          Toast.fire({
            icon: "success",
            title: `Te esperamos pronto!`,
            timer: 1500
          });

          setIsUserLogged(false);
          setUserHasPhoto(false)
          setPathPhoto("")
          localStorage.removeItem("accessToken");
          setTimeout(() => {
            setPathToRedirect('/')
            window.location.href = '/'
          }, 1500);

        } else {
          Toast.fire({
            icon: "error",
            title: "Some error ocurred. Try Again"
          })
        }
      });
  };
  //*Context Values

  const contextValue: SessionsContextType = {
    pathPhoto: pathPhoto,
    setPathPhoto: setPathPhoto,
    // setProfilePhotoUrl:setProfilePhotoUrl,
    handleConfirmPhoto: handleConfirmPhoto,
    setProfileData: setProfileData,
    profileData: profileData,
    isUserLogged: isUserLogged,
    setIsUserLogged: setIsUserLogged,
    setCLIENT_URL: setCLIENT_URL,
    CLIENT_URL: CLIENT_URL,
    logOut: logOut,
    pathToRedirect: pathToRedirect,
    setPathToRedirect: setPathToRedirect,
    setUserHasPhoto: setUserHasPhoto,
    userHasPhoto: userHasPhoto
  };
  return (
    <SessionsContext.Provider value={contextValue}>
      {children}
    </SessionsContext.Provider>
  );
}

export default SessionsContextProvider