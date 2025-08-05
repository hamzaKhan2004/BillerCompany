import Routing from "./router/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="">
      <Routing />
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default App;
