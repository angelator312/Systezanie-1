import { useSearchParams } from "@remix-run/react";
import type { Text } from "~/utils/textStore";
// import { HydrationProvider, Server } from "react-hydration-provider";
import BookHeader from "./bookHeader";
import NavYesOrNo from "./navbarYes";
import SearchComponent from "./Search";
import { Col, Container, Row } from "react-bootstrap";
import MenuForHome  from "./home.menu";
import type { SettingsInterface } from "~/utils/userStore";

export default function Home({
  user,
  books,
  settings,
}: {
  settings:SettingsInterface,
  user: string;
  books: Text[][];
}) {
  // const userId = useLoaderData<string>();
  // console.log(books[0]);

  const [searchParams, setSearchParams] = useSearchParams();
  let err = searchParams.get("err");
  const errCode = searchParams.get("errCode");
  if (!err)
    switch (errCode) {
      case "1":
        err = `Книгата не е завършена!!!`;
        break;

      default:
        break;
    }
  return (
    <Container fluid>
      {/* <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl  space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"> */}
      <NavYesOrNo
        text={err ?? ""}
        yes={false}
        f={(a: any) =>
          setSearchParams((prev) => {
            if (errCode) prev.set("errCode", "");
            if (err && !errCode) prev.set("err", "");
            return prev;
          })
        }
      />
      {/* <div className="m-l-15%"> */}
      <Row>
        <Col style={{ marginTop: "1rem" }}>
          <h1 className="text-slate-500 font-medium logo f-book-c">
            Книги-игри
          </h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <MenuForHome/>
        </Col>
      </Row>
      {/* </div> */}
      <Row className="mt-5">
        <Col>
          <div className="">
            {books[0].map((e, i) => (
              <Row key={i}>
                <Col>
                  <BookHeader e={e} avt={true} />
                </Col>
              </Row>
            ))}
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Container>
            <Row>
              <Col>
                <SearchComponent />
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  {books[1].map((e, i) => (
                    <Row key={i}>
                      <Col>
                        <BookHeader e={e} />
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
