import { Application, Context, Router } from "https://deno.land/x/oak/mod.ts";
import { openAIReq, scanImage } from "./controllers/index.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { config } from 'https://deno.land/x/dotenv/mod.ts';
config({export: true});

const router = new Router();

const verify = async (context: Context, next: () => Promise<unknown>) => {
  const headers: Headers = context.request.headers;
  if(headers.get("origin")==="https://ai-alt-tags.com") return await next();
  if(headers.get("origin")==="http://localhost:8000") return await next();
  // check DB to see status of user
  if(!headers.get('AI-Alt-API-Key')||(Deno.env.get("TEMP_UUID")!==headers.get('AI-Alt-API-Key'))) return context.response.status = 401;
  await next();
}

router
  .post("/", verify, async (context: Context) => {    
    const { request: req } = context;
    const { imgUrl } = await req.body().value;
    if(!imgUrl) return context.response.status = 400;
    const imageData = await scanImage(imgUrl);
    const imageDescription = await openAIReq(imageData);
    context.response.body = imageDescription;
  })

const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });