import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

type ProfileData = {
    email: string
    fullName: string
    role: string
}
  
const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>();
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8080/api/sessions/current", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setProfileData(res.data);
          console.log(profileData);
          
        } else {
          alert(`Loading data error. Try again`)
        }
      });
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];
    setPhotoFile(photoFile || null)
    if (photoFile) {
      const url = URL.createObjectURL(photoFile)
      setPhotoUrl(url)
    }
  }
  const uploadProfilePhoto = () => {
    console.log(`hii!!`);
    console.log(photoFile);
    
    
    
  }

  return (
    <div className="profileContainer pt-24 pb-8 ml-10">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="editOptions flex justify-end px-4 pt-4">
          <button
            id="dropdownButton"
            data-dropdown-toggle="dropdown"
            className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
            type="button"
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
          <div
            id="dropdown"
            className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul className="py-2" aria-labelledby="dropdownButton">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Edit
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Export Data
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center pb-10 gap-3">
          <div className="imgContainer w-24 h-24 group inline-block relative rounded-full">
            {photoUrl && <img
              className="w-full h-full rounded-full"
              src={photoUrl}
              alt="Bonnie image"
            />}
            <div className="opacity-0 group-hover:opacity-60 absolute inset-0 bg-black transition-opacity flex flex-col rounded-full items-center justify-center">
              <button onClick={uploadProfilePhoto}>
                hi
              </button>
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
                <span>Upload Photo</span>
              </label>
            </div>
          </div>

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
          <div className="flex mt-4 space-x-3 md:mt-6">
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Add friend
            </a>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
            >
              Message
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
