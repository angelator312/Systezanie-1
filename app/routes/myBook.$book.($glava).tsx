import type { Text as Text2 } from "~/utils/textStore";
import { redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import getTextStore from "~/utils/textStore";
import { requireUserId } from "~/utils/session.server";
import DropDown1 from "~/components/dropdown";
import { useEffect, useState } from "react";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import EditText from "~/components/editText";
import NavYesOrNo from "~/components/navbarYes";
import Book from "~/components/book";
import FormComponent from "~/components/formComp";
export async function action({ request }: ActionFunctionArgs) {
  return redirect(request.url);
}

type loaderData = [string, string, Text2, string, string[][],string];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const glava = params.glava;
  const book = params.book;
  if (!glava || Number.isNaN(parseInt(glava)))
    return redirect(`/myBook/${book}/1`);
  const a = await requireUserId(request, false);
  const tStore = await getTextStore();
  let b = await tStore.getBook(book ?? "");
  if (parseInt(glava) > parseInt(b?.doGl ?? "1")) {
    await tStore.addBook(
      b?.id?.substring(5, b.id?.length - 3) ?? "",
      b?.avtor ?? "",
      b?.public,
      b?.text2 ?? "",
      glava
    );
    if (b) b.doGl = glava;
  }
  // console.log(glava);
  if (typeof a === "string") {
    if (b?.avtor == a) {
      const comments = await tStore.getComments(book ?? "", glava);
      let t = await tStore.getText(`${book}-${glava}`);
      return [book, glava, t ?? tStore.prototypeOfText(), b.doGl, comments,a];
    }
    return redirect(`/book/${book}`);
  }
  return redirect("/login");
}
export default function Book1() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bUrl, gl, t, doN, comments,user] = useLoaderData<loaderData>();
  let comm = comments;
  function update() {
    textLines = text.split("\n\n");
    textLines = textLines.slice(2);
  }
  const [text, setText] = useState(
    //@ts-ignore
    typeof t === "string" ? "проба" : t?.text ?? "проба"
  );
  const [text2, setText2] = useState(
    //@ts-ignore
    typeof t === "string" ? "проба" : t?.text2 ?? "проба"
  );
  useEffect(() => {
    //@ts-ignore
    setText(typeof t === "string" ? "проба" : t?.text ?? "проба");
    //@ts-ignore
    setText2(typeof t === "string" ? "проба" : t?.text2 ?? "проба");
  }, [gl, t]);
  const feedCode = searchParams.get("feedCode");
  const errCode = searchParams.get("errCode");
  let [feedMsg] = useState(searchParams.get("feed"));
  let [errMsg] = useState(searchParams.get("err"));

  if (!feedMsg) {
    switch (feedCode) {
      case "1":
        feedMsg = "Запазването приключи!";
        break;
      case "2":
        feedMsg = "Публикуването завърши успешно!";
        break;

      default:
        break;
    }
  }

  if (!errMsg) {
    switch (errCode) {
      case "1":
        errMsg = "Моля въведете текст!";
        break;

      default:
        break;
    }
  }

  let textLines = text.replace("\r", "\n").split("\n\n");
  // let furst2Lines = [textLines[0], textLines[1]];
  textLines = textLines.slice(2);
  // console.log("t",t);
  // console.log(text, gl, text2);

  return (
    <div className="m-l-3">
      <NavYesOrNo text={feedMsg ?? ""} />
      <NavYesOrNo text={errMsg ?? ""} yes={false} />
      <br />
      <Tab.Container id="left-tabs-example" defaultActiveKey="editAndPreview">
        <Row>
          <Nav>
            <Col>
              <Nav.Item>
                <Nav.Link eventKey="editAndPreview">Редактирай</Nav.Link>
              </Nav.Item>
            </Col>
            <Col>
              <DropDown1
                url={`/myBook/${bUrl}`}
                // @ts-ignore
                doN={parseInt(doN ?? "15")}
                // @ts-ignore
                activeDrop={parseInt(gl)}
              />
            </Col>
            <Col>
              <Nav.Item>
                <Nav.Link
                  eventKey="editAndPreview"
                  onClick={() => {
                    window.open(`/myBook/see/${bUrl}/${gl}`);
                  }}
                >
                  Преглед
                </Nav.Link>
              </Nav.Item>
            </Col>
          </Nav>
        </Row>
        <Row>
          <Tab.Content
            id="uncontrolled-tab-example"
            className="mb-3"
            key={"space"}
          >
            {/* <Button eventKey="preview" title="Преглед" onClick={()=>{window.open(`/myBook/see/${bUrl}/${gl}`);}}> */}

            {/* </Button> */}
            <Tab.Pane eventKey="editAndPreview" title="Редактирай">
              <Container>
                <Row>
                  <Col>
                    <EditText
                      text={text}
                      text2={text2}
                      glava={gl ?? "1"}
                      bUrl={`${bUrl}`}
                      setText={setText}
                      setText2={setText2}
                      priIzvikvane={update}
                      key={gl}
                    />
                  </Col>
                  <Col>
                    <Book
                      url={`/myBook/${bUrl}`}
                      title={"Книга " + bUrl}
                      almP={`/myBook/${bUrl}/`}
                      flag={3}
                      params={{
                        text,
                        glava: gl,
                        text2,
                        user:user??"",
                        book:{text:bUrl}
                      }}
                      kr={false}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col sm="2"></Col>
                  <Col sm="6">
                    <FormComponent
                      to="/"
                      textForSubmit="Към главната страница"
                      method="get"
                      submitVariant="secondary"
                    />
                  </Col>
                  <Col>
                    <FormComponent
                      textsHidden={[
                        text.replace(/\\r/gm, "") ?? "a",
                        text2.replace(/\\r/gm, "") ?? "a",
                      ]}
                      to={`/myBook/${bUrl}/${gl}/save`}
                      textForSubmit="Запази промените"
                      submitVariant="danger"
                    />
                  </Col>
                </Row>
              </Container>
            </Tab.Pane>
          </Tab.Content>
          <Container>
            {/* @ts-ignore */}
            {comm.map((e, i) => (
              <Row key={e[0]}>
                <Col sm="7">
                  <NavYesOrNo
                    text={e[0].length > 0 ? `${e[0]}\n от ${e[1]}` : ""}
                    f={(a: any) => {
                      navigate(
                        `/myBook/${bUrl}/${gl}/deleteComment/${i}?p="sx"`
                      );
                    }}
                  />
                </Col>
              </Row>
            ))}
          </Container>
        </Row>
      </Tab.Container>
    </div>
  );
}
