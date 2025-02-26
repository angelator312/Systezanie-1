import type { ActionFunctionArgs, LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { requireUserId } from "~/utils/session.server";
import getTextStore from "~/utils/textStore";
import stylesUrl from "~/styles/login.css";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];
export async function action({ params, request }: ActionFunctionArgs) {
  const a = await requireUserId(request, true);
  const b = params.b;
  if (!a) return redirect("/login");
  if (typeof b !== "string") return redirect("/");
  const tStore = await getTextStore();
  tStore.deleteBook(b, a);
  return redirect("/");
}
export async function loader({ params, request }: LoaderFunctionArgs) {
  const a = await requireUserId(request, true);
  const tStore = await getTextStore();
  const b = await tStore.getBook(params.b ?? " ");
  if (b?.avtor == a || !b) return b;
  else return redirect("/");
}
// function stringCreator() {
//   function rand(from: number, to: number) {
//     return Math.floor(Math.random() * (to + 1 - from)) + from;
//   }
//   let str = "";
//   let len = rand(5, 10);
//   for (let i = 0; i < len; i++) {
//     const e = String.fromCharCode(rand(126, 33));
//     str += e;
//   }
//   return str;
// }
export default function Idea() {
  const book = useLoaderData<typeof loader>();
  const zagl = book?.id;
  return (
    <Container className="bg-i">
      <Row>
        <Col>
          <h1 className="text-slate-500 text-center text-dark">
            Наистина ли искаш да изтриеш книгата {zagl}?
          </h1>
        </Col>
      </Row>
      <Row className="m-5">
        <Col>
          <Form method="post">
            <Button type="submit" variant="danger">
              {"Да"}
            </Button>
          </Form>
        </Col>
        <Col>
          <Link to="/">
            <Button variant="secondary">Не</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
