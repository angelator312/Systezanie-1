// import { Outlet } from "@remix-run/react";
// import bcrypt from "bcryptjs";
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import getUserStore from "~/utils/mongostore";

// import { db } from "~/utils/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const pass = form.get("pass");
  const username = form.get("user");
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  if (typeof pass !== "string" || typeof username !== "string") {
    throw new Error("Form not submitted correctly.");
  }
  const users = await getUserStore();
  const isCorrectPassword = await users.checkUser(username, pass);
  if (!isCorrectPassword) {
    return redirect(`/login`);
  }
  return redirect(`/sandw`);

  //const fields = { content, name };

  //const joke = await db.joke.create({ data: fields });
};

export default function JokesRoute() {
  return (
    <div>
      <h1 className="home-link">
        <span className="logo">Login</span>
      </h1>
      <main className="login-main">
        <div className="container">
          <div>
            <p>Login</p>
            <form method="post">
              <div>
                <label>
                  Username: <input min="4" type="text" name="user" />
                </label>
              </div>
              <div>
                <label>
                  Password: <input min="8" name="pass" type="password" />
                </label>
              </div>
              <div>
                <button type="submit" className="button">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
