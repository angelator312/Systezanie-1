import { useSearchParams } from "@remix-run/react";
import type { Book } from "~/utils/textStore";
// import { HydrationProvider, Server } from "react-hydration-provider";
import BookHeader from "./bookHeader";
import NavYesOrNo from "./navbarYes";
import SearchComponent from "./Search";
import { Button, Col, Container, Row } from "react-bootstrap";
import MenuForHome from "./home.menu";
import type { SettingsInterface, User, UserData } from "~/utils/User";
import { Link } from "react-bootstrap-icons";
import { useEffect, useState } from "react";

export default function Home({
  user,
  books,
  settings,
  dataMy,
  dataNotMine,
}: {
  settings: SettingsInterface;
  user: User;
  books: Book[][];
  dataMy: UserData;
  dataNotMine: UserData[];
}) {
  // const userId = useLoaderData<string>();
  const [oshte0, setOshte0] = useState<boolean>(false);
  const [oshte1, setOshte1] = useState<boolean>(false);
  useEffect(() => {
    if (books[0].length > 5) {
      books[0] = books[0].slice(0, 5);
      setOshte0(true);
    }

    if (books[1].length > 5) {
      books[1] = books[1].slice(0, 5);
      setOshte1(true);
    }
  },[books]);
  // console.log(books[1], oshte1);

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
          <MenuForHome user={user} settings={settings} />
        </Col>
      </Row>
      {/* </div> */}
      <Row className="mt-5">
        <Col>
          <div className="bg-white bg-opacity-25 rounded-3 p-3">
            {books[0].map((e, i) => (
              <Row key={i}>
                <Col>
                  <BookHeader authorData={dataMy} e={e} avt={true} />
                </Col>
              </Row>
            ))}
            {oshte0 ? (
              <Row>
                <Col>
                  <Link to={"/mine"}>
                    <Button variant="outline-primary" className="text-sm">
                      Виж всички
                    </Button>
                  </Link>
                </Col>
              </Row>
            ) : null}
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <Container fluid className="bg-white bg-opacity-25 rounded-3 p-3">
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
                        <BookHeader authorData={dataNotMine[i]} e={e} />
                      </Col>
                    </Row>
                  ))}
                  {books[1].length <= 0 ? (
                    <h3 className="centered text-bold">Няма Резултати</h3>
                  ) : (
                    ""
                  )}
                  {oshte1 ? (
                    <Row>
                      <Col>
                        <a href={"/all?query=" + (searchParams.get("query")??"")}>
                          <Button variant="outline-primary" className="text-sm">
                            Виж всички
                          </Button>
                        </a>
                      </Col>
                    </Row>
                  ) : (
                    "aaa"
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
