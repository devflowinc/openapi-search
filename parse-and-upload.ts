const qdrantOpenapiSpec = Bun.file("qdrant_openapi.json");
import { ChunkApi, ChunkGroupApi, Configuration } from "@devflowinc/trieve-js-ts-client";

const trieveApiKey = Bun.env.TRIEVE_API_KEY ?? "";
const trieveDatasetId = Bun.env.TRIEVE_DATASET_ID ?? "";

const trieveApiConfig = new Configuration({
  apiKey: trieveApiKey,
  basePath: "https://api.trieve.ai",
});

const chunkGroupApi = new ChunkGroupApi(trieveApiConfig);

const qdrantOpenapiSpecTxt = await qdrantOpenapiSpec.text();
const qdrantOpenapiSpecJson = JSON.parse(qdrantOpenapiSpecTxt);

const tags = qdrantOpenapiSpecJson.tags;

for (const tag of tags) {
  try {
    const preExistingGroup = await chunkGroupApi.getChunksInGroupByTrackingId(trieveDatasetId, tag.name, 1);

    if (preExistingGroup.data.group.id) {
      console.log(`Chunk group already exists: ${tag.name}`);
      continue;
    }
  }
  catch (error) {
  }

  try {
    await chunkGroupApi.createChunkGroup(trieveDatasetId, {
      description: tag.description,
      name: tag.name,
      tracking_id: tag.name,
    });
    console.log(`Successfully created chunk group: ${tag.name}`);
  } catch (error) {
    console.error(`Failed to create chunk group: ${tag.name}`);
    console.error(error);
  }
}

const chunkApi = new ChunkApi(trieveApiConfig);

const paths = qdrantOpenapiSpecJson.paths;
const pathKeys = Object.keys(paths);

console.log(pathKeys);

for (const pathKey of pathKeys) {
  try {
    const path = paths[pathKey];

    if (!path) {
      console.log(`Path not found: ${pathKey}`);
      break;
    }

    const method = Object.keys(path)[0];
    const pathTags = path[method].tags;
    const pathSummary = path[method].summary;
    const pathDescription = path[method]?.requestBody?.description || path[method]?.description || "";

    try {
      await chunkApi.createChunk(trieveDatasetId, {
        chunk_html: `<p>Route at path ${pathKey}</p> \n\n <p>${pathSummary}</p> \n\n <p>${pathDescription}</p>`,
        link: `https://qdrant.github.io/qdrant/redoc/index.html?v=master#tag/${pathTags[0]}/operation/${path[method].operationId}`,
        tracking_id: pathKey,
        tag_set: pathTags,
        group_tracking_ids: pathTags,
        upsert_by_tracking_id: true,
      });
      console.log(`Successfully created chunk: ${pathKey}`);
    }
    catch (error) {
      console.error(`Failed to create chunk: ${pathKey}`);
      console.error(error);
    }
  } catch (error) {
    console.error(`Failed to create chunk: ${pathKey}`);
    console.error(error);
    break;
  }
}
