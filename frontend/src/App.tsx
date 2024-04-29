import { useEffect , useState } from "react"

import LoginPage from "./pages/Login";

function App() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = () => {
      fetch("http://localhost:3000/login/success", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            return response.json();
          }
          throw new Error("login has been failed!");  
        })
        .then((resObject) => {
          setUser(resObject);
        })
        .catch((err) => {
          console.log(err);
        });

        console.log('tsss');
    };
    getUser();
  }, [])

  return (
    <>
      {user === null ?  <LoginPage /> : <div>LoginSucess</div>}
    </>
  )
}

export default App
