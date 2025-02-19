import { Col, Row } from "react-bootstrap";
import IzborComponent from "./IzborComponent";
import { propertiesForColumnsWidth2 } from "~/utils/columnStyles";
import { useState } from "react";
import ZarcheComponent from "./ZarcheComponent";
import { regexForAdvancedDecoder as reg } from "~/utils/regex";
import Markdown from "react-markdown";

function matchAll(str: string): Array<Izbor | string> {
  let out: Array<Izbor | string> = [];
  let m: RegExpExecArray | null,
    predLastIndex = 0;
  while ((m = reg.exec(str)) !== null) {
    let zars: number[] = [];
    let disabled = false;
    if (m[4]) {
      disabled = true;
      let e = 0;
      zars = m[4]?.split(",").map((m) => {
        e = parseInt(m, 10);
        return e;
      });
    }
    if (reg.lastIndex > 0) {
      let sbstr = str
        .substring(predLastIndex, reg.lastIndex - m[0].length)
        .trim();
      if (sbstr) out.push(sbstr);
      predLastIndex = reg.lastIndex;
    }
    out.push(m[1]);
    out.push({
      isText: false,
      glava: parseInt(m[2], 10),
      zar: zars,
      scoreChange: parseInt(m[3] ?? "0", 10),
      text: m[5],
      disabled,
    });
  }
  let sbstr = str.substring(predLastIndex, str.length).trim();
  if (sbstr) out.push(sbstr);

  return out;
}

export interface Izbori {
  broiZarcheta: number;
  izbori: Izbor[];
}
export interface Izbor {
  isText: boolean;
  glava: number;
  zar: number | number[];
  scoreChange: number;
  text: string;
  disabled?: boolean;
}
export function DecoderAdvanced({
  text2: text,
  flag1 = true,
  url,
}: {
  text2: string;
  flag1?: boolean;
  url: string;
}) {
  let text2: string;
  // console.log(text2
  //TODO:Working Zar
  const [zarValue, setZarValue] = useState(-1);
  if (Array.isArray(text)) text2 = text[0];
  else text2 = text;
  if (!text2) return <></>;

  // const tM = [...text.matchAll(reg)];
  let broiZarcheta = 0;
  let arr2 = matchAll(text);
  console.log(arr2);

  let arr: { izb?: Izbor; text: string }[] = [];
  for (let i = 0; i < arr2.length; i++) {
    let m = arr2[i];
    // let zars: number[] = [];
    // let disabled = false;
    // if (zar) {
    //   disabled = true;
    //   let e = 0;
    //   zars = m[4]?.split(",").map((m) => {
    //     e = parseInt(m, 10);
    //     // if (zarValue == e) disabled = false;
    //     // broiZarcheta = Math.max((e + 5) / 6, broiZarcheta);
    //     return e;
    //   });
    // }
    if (typeof m === "string") {
      arr.push({ text: m });
    } else if (i == 0) {
      arr.push({ text: "", izb: m });
    } else {
      arr[arr.length - 1].izb = m;
    }
  }
  broiZarcheta = Math.floor(broiZarcheta);
  console.log(broiZarcheta);

  return (
    <>
      {broiZarcheta ? (
        <div className="mb-5">
          <ZarcheComponent
            onResult={(val) => {
              setZarValue(val);
            }}
            broiZarcheta={broiZarcheta}
          />
        </div>
      ) : null}
      {/* <ul> */}
      {arr.map((e, i) => (
        <div key={i}>
          {e.izb ? (
            <Row>
              <Col {...propertiesForColumnsWidth2}>
                <p className="text-bold">
                  <Markdown>{e.text}</Markdown>
                </p>
              </Col>
              <Col sm="2">
                <IzborComponent izbor={e.izb} url={url} flag={flag1} />
              </Col>
            </Row>
          ) : (
            <Markdown>{e.text}</Markdown>
          )}
        </div>
      ))}
      {/* </ul> */}
    </>
  );
}
