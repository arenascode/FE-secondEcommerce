import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Register = () => {
  const formRegister = document.getElementById("registerForm");
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [firstPassword, setFirstPassword] = useState("");
  const [minLengthPass, setMinLengthPass] = useState(true)
  const [repeatPassword, setRepeatPassword] = useState<string>("")
 
  useEffect(() => {
    console.log(`useEffec activado`);
    
    if (
      firstPassword.length >= 6 &&
      repeatPassword.length >= 6
    ) {
      console.log(`first condition`);
      
      console.log(firstPassword, repeatPassword);
      setPasswordMatch(true)
    } else {
      setPasswordMatch(false)
      console.log(`second condition`);
      
      console.log(firstPassword, repeatPassword);
      
    }
  }, [firstPassword, repeatPassword]);
  
  const handleWarningPass = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstPassword(e.currentTarget.value);
    
    if (firstPassword.length < 5) {
      console.log(firstPassword.length)
      setMinLengthPass(false)
    } else {
      setMinLengthPass(true)
    }
}

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formRegister instanceof HTMLFormElement) {
      e.preventDefault();
      const dataUser = new FormData(formRegister);
      const userName = dataUser.get("name");
      const userLastName = dataUser.get("lastName");
      const userEmail = dataUser.get("email");
      const userAge = dataUser.get("age");
      const userPass = dataUser.get("loginPassword");
      // const repeatUserPass = dataUser.get("repeatPassword");
      console.log(firstPassword);
      console.log(repeatPassword);

      if (firstPassword === repeatPassword) {
        const objDataUser = {
          first_name: userName,
          last_name: userLastName,
          email: userEmail,
          age: userAge,
          password: userPass,
        };
        console.log(objDataUser);

        fetch("http://127.0.0.1:8080/api/sessions/register", {
          method: "POST",
          body: JSON.stringify(objDataUser),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              Toast.fire({
                icon: "success",
                title: `We are glad that you are part`,
              });

              setTimeout(() => {
                window.location.href = "/login";
              }, 2000);

            } else if (response.status === 400) {
              const data = response.json();
              data.then((res) => Toast.fire({
                icon: "error",
                title: res.error
              })
              );
            }
          })
          .catch((error) => console.error(error.message));
      } else {
        Toast.fire({
          icon: "error",
          title: `The passwords don't match`,
        });
      }
      // formRegister.reset();
    }
  };

  return (
    <div className="RegisterFormContainer pt-20 pb-4 px-5">
      <form
        onSubmit={handleSubmit}
        id="registerForm"
        className="max-w-md mx-auto mt-4 p-4 border rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <br />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <br />

        <label htmlFor="email">Mail:</label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <br />

        <label htmlFor="age">Age:</label>
        <input
          type="number"
          id="age"
          name="age"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="loginPassword"
          name="loginPassword"
          onInput={handleWarningPass}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <br />

        <label htmlFor="repeatPassword">Repeat Password:</label>
        <input
          type="password"
          id="repeatPassword"
          name="repeatPassword"
          onInput={(e) => setRepeatPassword(e.currentTarget.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        {!(firstPassword === repeatPassword) && (
          <span className="text-red-500">Passwords do not match</span>
        )}
        <br />
        {minLengthPass ? '' : (
          <span className="text-red-500">
            Password Must be at least Six characters long
          </span>
        )}
        <br />
        <div className="flex flex-col items-center">
          <button
            disabled={!passwordMatch}
            type="submit"
            name="submit"
            className={`flex justify-center py-2 mt-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              !(
                (firstPassword !== "" || repeatPassword !== "") &&
                firstPassword.length >= 6 &&
                repeatPassword.length >= 6
              )
                ? "bg-gray-300"
                : "bg-gray-700 hover:bg-gray-800"
            }  tracking-wider`}
          >
            Register Me
          </button>
          <p className="mt-5">Are you already registered?</p>
          <a href="/login" className="text-blue-500">
            Log in !
          </a>
        </div>
      </form>
    </div>
  );
};
export default Register;
