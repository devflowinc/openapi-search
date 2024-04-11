# openapi-search with Trieve

## Prerequisites 

### Install Bun

Follow the guide at [bun.sh/docs/installation](https://bun.sh/docs/installation) to install.

## Replicate results

### Get Trieve Credentials 

1. `cp .env.dist .env`
2. Go to [dashboard.trieve.ai](https://dashboard.trieve.ai) and register or sign in
3. Create a dataset on the dashboard
4. Copy the dataset_id into the `.env` as the value for `TRIEVE_DATASET_ID`
5. Create an API key on the dashboard
6. Copy the API key into the `.env` as the value for `TRIEVE_API_KEY` 

### Upload the OpenAPI spec

1. `bun ./parse-and-upload.ts` 

### Try Search and Chat!!!

Navigate to the below links to try search and RAG with the Qdrant OpenAPI spec: 

- [search.trieve.ai](https://search.trieve.ai)
- [chat.trieve.ai](https://chat.trieve.ai)


