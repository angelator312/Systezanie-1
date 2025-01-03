import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import getTextStore from "~/utils/textStore";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const a = await requireUserId(request, false);
  // console.log(a);
  // console.log(await knigi(a));

  if (typeof a === "string") {
    const searchParams = new URL(request.url).searchParams;
    if (a == searchParams.get("user")) {
      let time = searchParams.get("time");
      if (time) {
        //console.log(Date.now(), parseInt(time) + 10);

        let timeNumber = Date.now() - (parseInt(time) + 10);
        const bookName = searchParams.get("book");
        if (bookName) {
          const tStore = await getTextStore();
          await tStore.addTime(bookName, Math.round(timeNumber/1000), a);
        }
      }
    }
    return redirect("/");
  }
  return redirect("/");
};