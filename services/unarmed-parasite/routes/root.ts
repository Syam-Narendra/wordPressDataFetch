import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { request } from "undici";
import fs from "fs";
declare module "fastify" {
  interface FastifyInstance {
    example: string;
  }
}
export default async function (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get("/fetch", async (req, reply) => {
    let pageNumber: number = 1;
    const fetchWordPressData = async () => {
      const { statusCode, headers, trailers, body } = await request(
        `https://wpengine.com/wp-json/wp/v2/posts?page=${pageNumber}&per_page=100`
      );
      if (statusCode === 200) {
        const data = await body.json();
        fs.writeFileSync("wordPressData.json", JSON.stringify(data, null, 2));
        console.log(pageNumber);
        pageNumber++;
        await fetchWordPressData();
      }
      return "Data Fetched";
    };
    const str = await fetchWordPressData();
    return { sucees: str };
  });
}
