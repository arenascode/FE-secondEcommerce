import { Link } from "react-router-dom";

const SessionExpired = () => {

  return (
    <div className="bg-gradient-to-tr from-gray-400 at-center to-stone-800 h-screen pt-40">
      <div className="card w-96 bg-base-100 shadow-xl lg:mt-28 lg:ml-96 m-auto sm:max-w-[95%] sm:p-0">
        <div className="card-body items-center text-center">
          <h1 className="card-title">Session Expired</h1>
          <p className="text-lg">Please Log in!</p>
          <div className="card-actions">
            <Link to={"/login"}>
              <button className="btn btn-success btn-sm mt-3 text-lg tracking-widest">
                Go
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SessionExpired