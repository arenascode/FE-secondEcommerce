// import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";

export type PhotoFile = File | null | string | undefined
export type ProfileData = {
  email: string;
  fullName: string;
  role: string;
  id: string;
};

type SessionsContextType = {
  profilePhotoUrl: PhotoFile;
  setProfilePhotoUrl: React.Dispatch<React.SetStateAction<PhotoFile>>;
  handleConfirmPhoto: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>;
  profileData: ProfileData | null;
};

const SessionsContext = createContext<SessionsContextType>({
  setProfilePhotoUrl: () => { },
  profilePhotoUrl: null,
  handleConfirmPhoto: () => { },
  setProfileData: () => { },
  profileData: null
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


  //* Current Session */
  

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<File | null | string | undefined>(null);

  const handleConfirmPhoto = (e:React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.dataset.userId);
    console.log(`hii!!`);
    
    // axios.put(`http://127.0.0.1:8080/api/users/${profileData?.id}`)
    //   .then((res) => {
    //     console.log(res);
    //     setProfilePhotoUrl(res.data.profilePhoto)
      
    // })
  };

  //*Context Values

  const contextValue: SessionsContextType = {
    profilePhotoUrl: profilePhotoUrl,
    setProfilePhotoUrl: setProfilePhotoUrl,
    handleConfirmPhoto: handleConfirmPhoto,
    setProfileData: setProfileData,
    profileData: profileData
    
  };
  return (

    <SessionsContext.Provider value={contextValue}>
      {children}
    </SessionsContext.Provider>
  );
}

export default SessionsContextProvider