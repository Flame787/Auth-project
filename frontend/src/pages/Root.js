import { Outlet, useLoaderData } from "react-router-dom";
import { useSubmit } from "react-router-dom";
import { useEffect } from "react";

import MainNavigation from "../components/MainNavigation";
import { getTokenDuration } from "../util/authtoken";

function RootLayout() {
  // const navigation = useNavigation();

  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token || token === "EXPIRED") {
      return;
    }

    // if (token === "EXPIRED") {
    //   submit(null, { action: "/logout", method: "post" });
    //   return;
    // }

    const tokenDuration = getTokenDuration();
    console.log(tokenDuration);

    const timer = setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
      // }, 1 * 60 * 60 * 1000);
    }, tokenDuration);
    // 1 hour in miliseconds - after 1 h the token dissapears and user is logged out authomatically
    return () => clearTimeout(timer);
    
  }, [token, submit]);
  // whenever the Root component is rendered, or when token or submit-function changes, this useEffect function executes.

  return (
    <>
      <MainNavigation />
      <main>
        {/* {navigation.state === 'loading' && <p>Loading...</p>} */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
