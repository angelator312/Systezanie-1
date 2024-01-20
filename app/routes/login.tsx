// import { Outlet } from "@remix-run/react";
// import bcrypt from "bcryptjs";
import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { createUserSession } from "~/utils/session.server";
import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
// import  { User } from "~/utils/mongostore";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Link, useSearchParams } from "@remix-run/react";

import stylesUrl from "~/styles/login.css";
import getUserStore from "~/utils/mongostore";
import { Link } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];
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
  const userCheck = await users.checkUser(username, pass);
  if (!userCheck) {
    return redirect(`/login`);
  }
  // type UserWId=Omit(User,"_id",);

  const url = request.url;
  const searchParams = new URLSearchParams(url);

  return createUserSession(
    userCheck.user,
    searchParams.get("redirectTo") ?? "/"
  );

  //const fields = { content, name };

  //const joke = await db.joke.create({ data: fields });
};


function FormExample() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div>
      <h1 className="centered">Login</h1>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        method="POST"
      >
        <Row className="mb-3">
          <Form.Group as={Row} className="mb-3" controlId="validationCustom01">
            <Form.Label column sm="2">
              Username
            </Form.Label>
            <Col sm="10">
              <Form.Control
                required
                type="text"
                placeholder="Usernname"
                name="user"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please input a username.
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="validationCustom02">
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control
                required
                type="password"
                placeholder="Password"
                name="pass"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please input a password.
              </Form.Control.Feedback>
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Col sm="2"></Col>
          <Col sm="10">
            <Button type="submit" className="centered m-r-3">
              Login
            </Button>

            <Link to="/signup">
              <Button variant="success">Sign up</Button>
            </Link>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default FormExample;
