import { useState } from "react";

const Register = () => {

  const formRegister = document.getElementById('registerForm')
  // const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
  const [firstPassword, setFirstPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formRegister instanceof HTMLFormElement) {
      formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const dataUser = new FormData(formRegister);
        const userName = dataUser.get("name");
        const userLastName = dataUser.get("lastName");
        const userEmail = dataUser.get("email");
        const userAge = dataUser.get("age");
        const userPass = dataUser.get("loginPassword");
        const repeatUserPass = dataUser.get("repeatPassword");

        if (userPass === repeatUserPass) {
          const objDataUser = {
            name: userName,
            lastName: userLastName,
            email: userEmail,
            age: userAge,
            password: userPass,
          };

          fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(objDataUser),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                alert("We are glad that you are part");
                window.location.href = "/login";
              }
            })
            .catch((error) => console.error(error.message));
        } else {
          alert(`The passwords don't match`);
        }
        formRegister.reset();
      });
    }
  };


  return (
    <div className="RegisterFormContainer pt-20 pb-4 px-5">
      <form
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
          onInput={(e) => setFirstPassword(e.currentTarget.value)}
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

        <div className="flex flex-col items-center">
          <button
            type="submit"
            name="submit"
            className=" flex justify-center py-2 mt-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 tracking-wider"
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
