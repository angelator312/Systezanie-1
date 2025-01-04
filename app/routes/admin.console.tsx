import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Col, Container, Form, Row } from "react-bootstrap";
import MenuForHome from "~/components/home.menu";
import { requireUserId } from "~/utils/session.server";
import type { SettingsInterface, User } from "~/utils/userStore";
import getUserStore from "~/utils/userStore";
export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  if (typeof userId === "string") {
    const uStore = await getUserStore();
    const user = await uStore.isAdmin(userId);
    if (user) {
      uStore.FixDatabase();
      return null;
    }
  }
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const a = await requireUserId(request, false);
  // console.log(a);
  // console.log(await knigi(a));

  if (typeof a === "string") {
    const uStore = await getUserStore();
    const user = await uStore.getUser(a);
    if (user&&Object.hasOwn(user,"admin"))
      if (user.admin == true) {
        return [user, user.settings ?? uStore.getDefaultSettings()];
      }
  }
  return redirect("/");
};

type loaderType = [User, SettingsInterface];
export default function AdminRoute() {

  const [user, settings] = useLoaderData<loaderType>();
  return (
    <Container>
      <Row>
        <Col>
          <h1>Admin Console</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form method="POST" action="/admin/console">
            <Form.Control type="submit" value={"Update Users"} />
          </Form>
        </Col>
      </Row>

      <MenuForHome
      //@ts-ignore
      user={user} settings={settings}/>
    </Container>
  );
}
