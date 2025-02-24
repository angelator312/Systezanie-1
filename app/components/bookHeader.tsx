import { Col, Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { AuthorResume } from "./userResume";
import type { UserData } from "~/utils/User";
import type { BookInterface } from "~/utils/textStore";

export default function BookHeader({
  e,
  avt = false,
  authorData,
}: {
  authorData: UserData;
  e: BookInterface;
  avt?: boolean;
}) {
  if (!e) return;
  return (
    <Container fluid className="mb-4">
      <Row>
        <Col xs={3} md={1}>
          <img src="/img/book-60.png" alt="Book" className="book-image" />
        </Col>
        <Col xs={9} md={7}>
          <a className="link-clear" href={!avt ? `/book/intro/${e.text}` : `/myBook/${e.text}`}>
            <h3 className="text-bold text-dark">{e.id}</h3>
          </a>
          <AuthorResume authorData={authorData} authorName={e.avtor ?? ""} />
        </Col>
        {/* <Col className="text-bold text-dark" xs={6} md={2}> */}
        {/* </Col> */}
        {/* <br /> */}
        <Col className="text-center" xs={12} md={2}>
          {avt ? (
            <DropdownButton title="Действия" id="dropdown-basic-button">
              <Dropdown.Item
                //method=post
                href={`/book/intro/${e.text}/`}
              >
                Прочети ме
              </Dropdown.Item>
              <Dropdown.Item
                //method=post
                href={`/myBook/${e.text}/publish`}
                disabled={e.public}
              >
                Публикувай
              </Dropdown.Item>
              <Dropdown.Item href={`/delete/${e.text}/`}>Изтрий</Dropdown.Item>
            </DropdownButton>
          ) : (
            ""
          )}
        </Col>
      </Row>
    </Container>
  );
}
