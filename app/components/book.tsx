import { useLoaderData } from "@remix-run/react";
// import menu from "~/helps/menu.png";
import Text from "./text";
import FormComponent from "./formComp";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import type { loaderBook } from "~/utils/loaderTypes";
import MenuForHome from "./home.menu";
import type { User, UserData } from "~/utils/User";
import { getDefaultSettings, getDefaultUser } from "~/utils/User";
import type { VariableInterface } from "~/utils/VariableThings";
import { getDefaultVariable } from "~/utils/VariableThings";
import { CommentsVisualizer } from "./commentsVisualizer";
import { CommentInterface } from "~/utils/comments";

interface Params {
  text: string;
  glava: string;
  text2: string;
  user: User;
  book: { text: string };
  variables: { [key: string]: VariableInterface };
}

export default function BookPreview({
  url,
  title,
  almP,
  kr = true,
  flag = 0,
  params = {
    text: "This is not mandatory",
    glava: "glava",
    text2: "This is not mandatory",
    user: getDefaultUser(),
    book: { text: "Problem" }, //{ text: Името на книгата },
    variables: {},
  },
  commentThings = {comInt:[],datas:[]},
}: {
  url: string;
  title: string;
  almP: string;
  kr?: boolean;
  flag?: number;
  params?: Params;
  commentThings?:{ comInt:CommentInterface[],datas:UserData[]};
}) {
  const loaderData = useLoaderData<loaderBook>();
  if (!flag) {
    var book = loaderData.bookObj;
    var { text, glava, text2, user, variables } = loaderData;
  }
  //@ts-ignore
  else var { text, glava, text2, user, book, variables } = params;
  // else
  //  { text, glava, text2 } = useLoaderData<typeof loader>();
  // console.log(flag,text,glava,text2);

  let textLines = text.replaceAll("\r", "").split("\n\n");
  const [timeIn] = useState(Date.now());
  useEffect(() => {
    // const handleUnload = async() => {
    //   await fetch(
    //     "/analyses/timeForUser?user=" +
    //       user +
    //       "&time=" +
    //       timeIn+
    //       "&book=" +
    //       book.text
    //   );
    // };
    // window.addEventListener("beforeunload", handleUnload);
    //return () => window.removeEventListener("beforeunload", handleUnload); // cleanup
  }, []);
  // console.log(12);
  //  "0".matchAll(reg);
  // Array.from(text2.matchAll(reg));
  // const {book}= useLoaderData<string>();
  return (
    <Container className="space-y-2 sm:text-left bg-i">
      <MenuForHome
        isInBook={true}
        timeIn={timeIn}
        user={user}
        bookNow={book.text}
        settings={user.settings ?? getDefaultSettings()}
      />
      <Row>
        <Col>
          <Text
            variables={variables ?? [getDefaultVariable()]}
            glava={glava}
            url={url}
            textLines={textLines}
            text2Lines={text2.replaceAll("\r", "")}
            flag1={!flag}
            title={title}
          />
        </Col>
      </Row>
      {kr ? (
        <Row>
          <Col>
            <CommentsVisualizer comments={commentThings.comInt} bId={book.text} chapter={parseInt(glava,10)} userName={user.user} autDatas={commentThings.datas}/>
          </Col>
        </Row>
      ) : (
        ""
      )}
    </Container>
  );
}
