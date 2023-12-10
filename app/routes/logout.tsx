import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { logout } from "~/utils/session.server";
import stylesUrl from "~/styles/login.css";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await logout(request);
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export default function LogoutRoute() {
  //   eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const [searchParams] = useSearchParams();
  return (
    <div>
      <h1 className="home-link">
        <span className="logo">Logout</span>
      </h1>
      <main className="login-main">
        <div className="container">
          <div>
            <h2>Are you sure you want to log out??</h2>
            <form method="post">
              {/* <div>
                <label htmlFor="username-input">Username</label>
                <input type="text" id="username-input" name="user" />
              </div> */}

              {/* <div>
                <label htmlFor="password-input">Password</label>
                <input id="password-input" name="pass" type="password" />
              </div> */}

              <button type="submit" style={{ width: 45 }} className="button">
                Yes
              </button>
            </form>
            <Link to="/">
              <button type="submit" style={{ width: 45 }} className="button">
                No
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
