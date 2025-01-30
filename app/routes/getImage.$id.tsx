import type { LoaderFunctionArgs } from "@remix-run/node";
import { ObjectId } from "mongodb";
import getFileStore from "~/utils/fileStore";

export async function loader({request,params}:LoaderFunctionArgs)
{
    const imStore=await getFileStore();
    const img= await imStore.getImage(new ObjectId(params.id??""));
    // console.log(img);
    if(img)
    {
        return new Response(img.data.buffer, {
            headers: {
                "Content-Type":img.mimeType ,
            },
        }); 
    }else 
    {
        return new Response("Not Found The Image", {
            status: 404,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}