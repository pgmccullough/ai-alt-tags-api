import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { openAIReq, scanImage } from "./controllers/index.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const router = new Router();

const verify = async (context: Context, next: () => Promise<unknown>) => {
  const headers: Headers = context.request.headers;
  // check DB to see status of user
  console.log(headers.get('AI-Alt-API-Key'),config().TEMP_UUID);
  if(!headers.get('AI-Alt-API-Key')||(config().TEMP_UUID!==headers.get('AI-Alt-API-Key'))) return context.response.status = 401;
  await next();
}

router
  .post("/api", verify, async (context: Context) => {    
    const { request: req } = context;
    const { imgUrl } = await req.body().value;
    if(!imgUrl) return context.response.status = 400;
    const imageData = await scanImage(imgUrl);
    const imageDescription = await openAIReq(imageData);
    context.response.body = imageDescription;
  })

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });