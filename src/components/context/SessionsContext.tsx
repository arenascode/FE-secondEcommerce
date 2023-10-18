// import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import axios from "axios";

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
  logOut: () => void
  
};

const SessionsContext = createContext<SessionsContextType>({
  /* setProfilePhotoUrl: () => { },
  profilePhotoUrl: null, */
  handleConfirmPhoto: () => { },
  setProfileData: () => { },
  profileData: null,
  setIsUserLogged: () => { },
  isUserLogged: false,
  pathPhoto: '',
  setPathPhoto: () => { },
  setCLIENT_URL: () => { },
  CLIENT_URL: null,
  logOut: () => {}
})

export const useSessions = () => {
  return useContext(SessionsContext)
}


//* Current Session
type SessionsContextProviderProps = {
  children: ReactNode
}
const SessionsContextProvider = ({children}: SessionsContextProviderProps) => {

  //**Register Session */

  //**Login Session */
  const [isUserLogged, setIsUserLogged] = useLocalStorage<boolean>('userLogged', false)
  console.log(isUserLogged);
  
  const [CLIENT_URL, setCLIENT_URL] = useLocalStorage<string>('CLIENT_URL','')
  //* Current Session */
  

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [pathPhoto, setPathPhoto] = useLocalStorage<string>('profilePic', 'notRefresh');

  const handleConfirmPhoto = (e:React.MouseEvent<HTMLButtonElement>) => {
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
          alert(`Te esperamos pronto!`);
          setIsUserLogged(false);
          setPathPhoto("");
          
        } else {
          alert("some error ocurred. Try Again");
        }
      }); 
  }
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
    logOut: logOut
  };
  return (

    <SessionsContext.Provider value={contextValue}>
      {children}
    </SessionsContext.Provider>
  );
}

export default SessionsContextProvider