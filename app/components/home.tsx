import { Link, useSearchParams } from "@remix-run/react";
import type { Text } from "~/utils/textStore";
// import { HydrationProvider, Server } from "react-hydration-provider";
import BookHeader from "./bookHeader";
import NavYesOrNo from "./navbarYes";
import Settings from "./settings";
import SearchComponent from "./Search";
import { Col, Container, Row } from "react-bootstrap";

export default function Home({
  user,
  books,
}: {
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
    <Container>
      {/* <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl  space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6"> */}
      <Container>
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
          <Col style={{ paddingTop: "1rem" }}>
            <h1 className="text-slate-500 font-medium logo f-book-c">
              Книги-игри
            </h1>
          </Col>
        </Row>
        <br />
        <Row>
          <Col style={{ paddingTop: "1rem" }}>
            <h3 className="font-medium text-dark">Здравей {user}</h3>
          </Col>
        </Row>
        {/* </div> */}
        {/* </div> */}
        <br />

        <Row>
          <Col style={{ paddingTop: "1rem" }}>
            <Link to="/newBook" className="">
              <span className="text-slate-500 font-medium logo text-center text-primary">
                Нова книга
              </span>
            </Link>
          </Col>
        </Row>
        <br />
        <Settings />
        <br />
        <Row>
          <Col style={{ paddingTop: "1rem" }}>
            <Link to="/logout" className="">
              <span className="text-slate-500 font-medium logo text-center text-primary">
                Излез от профила
              </span>
            </Link>
          </Col>
        </Row>
        <br />
        <br />
        {/* </div> */}
        <Container>
          {books[0].map((e, i) => (
            <BookHeader e={e} key={i} avt={true} />
          ))}
        </Container>
        <hr />
        <SearchComponent />
        <div className="centered text-center m-l-45%">
          {books[1].map((e, i) => (
            <BookHeader e={e} key={i} />
          ))}
        </div>
      </Container>
      <br />
    </Container>
  );
}
