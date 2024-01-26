import axios from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSessions } from "../context/SessionsContext";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CloseOutlined } from "@mui/icons-material";
import SessionExpired from "./SessionExpired";

type ProfileData = {
  email: string;
  first_name: string;
  last_name: string;
  fullName: string;
  age: number;
  role: string;
  id: string;
};

export type PhotoFile = File | null | string;

const Profile = () => {
  const {
    isUserLogged,
    setIsUserLogged,
    setPathPhoto,
    pathPhoto,
    logOut,
    userHasPhoto,
    setUserHasPhoto,
    setProfileData,
    profileData,
  } = useSessions();

  // const [profileData, setProfileData] = useState<ProfileData>();
  const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false);
  const [showEditBtn, setShowEditBtn] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [errorMail, setErrorMail] = useState<boolean>(false);
  const [firstPassword, setFirstPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const CLIENT_URL = useRef<string | null>(null);
  const targetDivRef = useRef<HTMLDivElement>(null);

  const { isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      //Review this:
      // setUserHasPhoto(false); //
      axios
        .get("http://127.0.0.1:8080/api/sessions/current", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            setProfileData(res.data.currentUserDTO);

            axios(
              `http://127.0.0.1:8080/api/users/${res.data.currentUserDTO.id}`
            ).then((user) => {
              const photoPath = user.data.profilePhoto;

              if (photoPath) {
                // const staticWord = "static";
                // const trimmingPath = photoPath.slice(6);
                CLIENT_URL.current = res.data.CLIENT_URL;
                const newPath = `http://${CLIENT_URL.current}/${photoPath}`;
                setPathPhoto(newPath);
                setUserHasPhoto(true);
              }
              setIsUserLogged(true);
            });
          }
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setIsUserLogged(false);
            setProfileData(null);
          }
        });
    },
  });

  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: async (formToSend) => {
      return axios
        .put(`http://127.0.0.1:8080/api/users/${profileData?.id}`, formToSend, {
          withCredentials: true,
        })
        .then(() => {
          setShowEditForm(false);
        })
        .catch((err) => console.log(err));
    },
    onSuccess: () => {
      refetch()
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPathPhoto(url);
      setIsPhotoUploaded(true);
      setUserHasPhoto(true);
    }
  };

  //*Component
  interface ChildComponentProps {
    userId: string | undefined;
  }

  const ConfirmProfilePhotoBtn: React.FC<ChildComponentProps> = (props) => {
    const { userId } = props;

    const handleConfirmPhoto = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log(e.currentTarget.dataset.userid);
      const uid = e.currentTarget.dataset.userid;

      const formProfilePic = document.getElementById(
        "editFormProfilePhoto"
      ) as HTMLFormElement;

      const formData = new FormData(formProfilePic);
      const filesInput = formData.get("newProfilePhoto");
      console.log(filesInput);

      axios
        .put(`http://127.0.0.1:8080/api/users/${uid}`, formData)
        .then((res) => {
          console.log(res);
          const photoPath = res.data.userPhotoUpdated.profilePhoto;

          // const staticWord = "static";
          // const trimmingPath = photoPath.slice(6);
          // const newPath = staticWord + trimmingPath;
          // console.log(`new path ${newPath}`);
          CLIENT_URL.current = res.data.CLIENT_URL;

          setPathPhoto(`http://${CLIENT_URL.current}/${photoPath}`);

          console.log(pathPhoto);

          // console.log(profilePhotoUrl);
          setIsPhotoUploaded(false);
          setUserHasPhoto(true);
        })
        .catch((err) => console.log(err));
    };

    return (
      <div className="confirmPhotoBtn bg-gradient-to-r from-green-300 to-green-700 hover:from-green-400 hover:to-green-800 text-white font-bold py-0.5 px-3 rounded-full">
        <button
          className="text-sm"
          data-userid={userId}
          onClick={handleConfirmPhoto}
        >
          confirm Photo
        </button>
      </div>
    );
  };

  //** Function To handle Log Out */
  const handleLogOut = () => {
    logOut();
  };

  useEffect(() => {
    if (firstPassword !== repeatPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }, [firstPassword, repeatPassword]);

  const handleShowEditFormBtn = () => {
    setShowEditBtn(!showEditBtn);
  };

  const handleShowEditForm = () => {
    setShowEditForm(!showEditForm);
    setShowEditBtn(false);
    if (window.innerWidth <= 765) {
      setTimeout(() => {
        if (targetDivRef.current) {
          targetDivRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };
  //* fetch to edit Profile
  const fetchEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const form = document.getElementById("editProfileForm");
    const formProfile = new FormData(form as HTMLFormElement);

    const formToSend = new FormData();

    for (const [key, value] of formProfile.entries()) {
      if (value != "" && value != "null") {
        formToSend.append(key, value);
      }
    }
    const email = formToSend.get("email");
    formToSend.delete("repeatPassword");

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== null && !pattern.test(email as string)) {
      setErrorMail(true);
      return;
    }

    userMutation.mutate(formToSend);
  };

  const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name == "email") {
      setErrorMail(false);
    }
  };

  const handlePasswords = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordMatch(true);
    if (e.currentTarget.name == "password") {
      setFirstPassword(e.currentTarget.value);
    } else if (e.currentTarget.name == "repeatPassword") {
      setRepeatPassword(e.currentTarget.value);
    }
  };

  return isUserLogged ? (
    <div className="profileContainer bg-gradient-to-tr from-gray-400 at-center to-stone-800 pt-24 pb-8 p-10 md:pt-24 md:p-5 flex place-content-center sm:flex-col md:flex-row sm:gap-2 md:gap-10 min-h-screen">
      <div className="left flex-1 sm:w-full md:w-max md:max-w-max">
        {profileData ? (
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 md:w-[330px]">
            <div className="flex px-4 pt-4 flex-col justify-end relative">
              <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 self-end w-max"
                type="button"
                onClick={handleShowEditFormBtn}
              >
                <span className="sr-only">Open dropdown</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
              {/* <!-- Dropdown menu --> */}
              {showEditBtn && (
                <div
                  id="dropdown"
                  className="z-99 text-base list-none text-white divide-y divide-gray-100 rounded-lg shadow w-max dark:bg-gray-700 self-end absolute top-[3.2rem] right-2 justify-end bg-info"
                >
                  <ul
                    className="text-right flex justify-end"
                    aria-labelledby="dropdownButton"
                  >
                    <li className="flex self-end justify-end">
                      <a
                        href="#"
                        className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white self-end "
                        onClick={handleShowEditForm}
                      >
                        Edit User
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center pb-10 gap-3 md:px-16">
              <div className="imgContainer w-24 h-24 group inline-block relative rounded-full">
                {pathPhoto && typeof pathPhoto === "string" ? (
                  <img
                    className="w-full h-full rounded-full"
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "src/assets/user.png"
                    }
                    alt="Profile Picture"
                  />
                ) : (
                  <img
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "/src/assets/user.png"
                    }
                    className="w-full h-full rounded-full"
                  />
                )}
                <div className="opacity-0 group-hover:opacity-60 absolute inset-0 bg-black transition-opacity flex flex-col rounded-full items-center justify-center">
                  <form id="formProfilePhoto" encType="multipart/form-data">
                    <input
                      onChange={handleFileChange}
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      hidden
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="inset-0 cursor-pointer flex flex-col items-center w-7 h-auto"
                    >
                      <img
                        src="src/assets/icons/camara.png"
                        alt=""
                        className="w-full h-auto"
                      />
                      <span className="text-white">Upload Photo</span>
                    </label>
                  </form>
                </div>
              </div>
              {isPhotoUploaded && (
                <ConfirmProfilePhotoBtn userId={profileData.id} />
              )}
              <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                {profileData?.fullName}
              </h5>
              <div className="Role flex items-center gap-1">
                <h3>E-Mail:</h3>
                <span className="text-md text-gray-500 dark:text-gray-400">
                  {profileData?.email}
                </span>
              </div>
              <div className="Role flex items-center gap-1">
                <h3>Role:</h3>{" "}
                <span className="text-md text-gray-500 dark:text-gray-400">
                  {profileData?.role}
                </span>
              </div>
              {profileData.role === "admin" && (
                <Link to={"/manageStore"}>
                  <button className="btn btn-sm">Manage Store</button>
                </Link>
              )}
              <div className="flex mt-4 space-x-3 md:mt-6">
                <button
                  onClick={handleLogOut}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-error hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading Data...</p>
        )}
      </div>
      {showEditForm && (
        <div className="right flex-1 sm:w-full md:w-max md:max-w-max ">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow pt-4 dark:bg-gray-800 dark:border-gray-700 xl:w-[600px]">
            <div className="flex px-4 flex-col justify-end relative">
              <button
                id="dropdownButton"
                data-dropdown-toggle="dropdown"
                className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5 self-end w-max"
                type="button"
              >
                <CloseOutlined onClick={() => setShowEditForm(false)} />
              </button>
            </div>
            <div
              ref={targetDivRef}
              className="flex flex-col items-center pb-4 gap-2 md:w-[350px] xl:w-full"
            >
              <div className="imgContainer w-24 h-24 group inline-block relative rounded-full">
                {pathPhoto && typeof pathPhoto === "string" ? (
                  <img
                    className="w-full h-full rounded-full"
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "src/assets/user.png"
                    }
                    alt="Profile Picture"
                  />
                ) : (
                  <img
                    src={
                      isUserLogged && userHasPhoto
                        ? `${pathPhoto}`
                        : "/src/assets/user.png"
                    }
                    className="w-full h-full rounded-full"
                  />
                )}
                <div className="opacity-0 group-hover:opacity-60 absolute inset-0 bg-black transition-opacity flex flex-col rounded-full items-center justify-center">
                  <form id="editFormProfilePhoto" encType="multipart/form-data">
                    <input
                      onChange={handleFileChange}
                      type="file"
                      name="profilePhoto"
                      id="newProfilePhoto"
                      hidden
                    />
                    <label
                      htmlFor="profilePhoto"
                      className="inset-0 cursor-pointer flex flex-col items-center w-7 h-auto"
                    >
                      <img
                        src="src/assets/icons/camara.png"
                        alt=""
                        className="w-full h-auto"
                      />
                      <span className="text-white">Upload Photo</span>
                    </label>
                  </form>
                </div>
              </div>
              {isPhotoUploaded && (
                <ConfirmProfilePhotoBtn userId={profileData?.id} />
              )}
              <form
                id="editProfileForm"
                className="flex flex-col gap-1 w-full px-4"
              >
                <label
                  htmlFor="firstName"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    placeholder="First Name"
                    className="border-none w-full"
                    onChange={handleChangeInputs}
                  />
                </label>

                <label
                  htmlFor="lastName"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Last Name"
                    name="last_name"
                    className="border-none w-full"
                    onChange={handleChangeInputs}
                  />
                </label>

                <label
                  htmlFor="age"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="number"
                    id="age"
                    placeholder="Age"
                    className="border-none w-full "
                    name="age"
                    onChange={handleChangeInputs}
                  />
                </label>
                <label
                  htmlFor="email"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="email"
                    id="email"
                    placeholder="E-Mail"
                    className="border-none w-full "
                    name="email"
                    onChange={handleChangeInputs}
                  />
                </label>
                {errorMail && (
                  <span className="text-sm text-red-400">
                    Invalid eMail Format
                  </span>
                )}
                {/* <div className="relative">
                  <label
                    htmlFor="fileInput"
                    className="cursor-pointer text-blue-500 border border-blue-500 rounded-md px-4 py-2 inline-block"
                  >
                    Choose File
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    // Add your onChange handler here if needed
                  />
                </div> */}
                <label
                  htmlFor="email"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="border-none w-full "
                    name="password"
                    onChange={handlePasswords}
                  />
                </label>
                <label
                  htmlFor="repeatPassword"
                  className="border-b border-gray-300 focus:border-blue-500"
                >
                  <input
                    type="password"
                    id="repeatPassword"
                    placeholder="Repeat Password"
                    className="border-none w-full "
                    name="repeatPassword"
                    onChange={handlePasswords}
                  />
                </label>
                {!passwordMatch && (
                  <span className="text-sm text-red-400">
                    Passwords doesn't match
                  </span>
                )}
                <button
                  type="submit"
                  className={`btn btn-sm btn-info w-max rounded-md align-middle justify-center m-auto mt-3`}
                  onClick={fetchEditProfile}
                  disabled={!passwordMatch || errorMail}
                >
                  Edit Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <SessionExpired />
  );
};
export default Profile;
