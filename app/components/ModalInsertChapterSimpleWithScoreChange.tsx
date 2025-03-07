import { useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";

export function ModalInsertChapterSimpleWithScoreChange({
  showInsertChapter,
  handleCloseInsertChapter,
  handleInsertChapter,
}: {
  showInsertChapter: boolean;
  handleCloseInsertChapter: () => void;
  handleInsertChapter: (
    insertChapter: number,
    scoreChange: number,
    text: string
  ) => void;
}) {
  const [insertChapter, setInsertChapter] = useState(0);
  const [scoreChange, setScoreChange] = useState(0);
  const [insertText, setInsertText] = useState("");
  return (
    <Modal show={showInsertChapter} onHide={handleCloseInsertChapter}>
      <Modal.Header closeButton>
        <Modal.Title>Вмъкни Глава</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <label>Номер на глава:</label>
            <input
              value={insertChapter}
              onChange={(e) => setInsertChapter(parseInt(e.target.value))}
              type="number"
              placeholder="Глава"
            />
          </Col>{" "}
          <Col>
            <label>Текст в бутона:</label>
            <input
              value={insertText}
              onChange={(e) => setInsertText(e.target.value)}
              type="string"
              placeholder="Текст в бутона"
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <label>С колко се променя променливата "резултат":</label>
            <input
              value={scoreChange}
              onChange={(e) => setScoreChange(parseInt(e.target.value))}
              type="number"
              placeholder="+21"
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col>
            <Button variant="secondary" onClick={handleCloseInsertChapter}>
              Затвори
            </Button>
          </Col>
          <Col>
            <Button
              variant="primary"
              onClick={() =>
                handleInsertChapter(insertChapter, scoreChange, insertText)
              }
            >
              Вмъкни
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
}
