import axios from 'axios';

export const deploy = async ({ host, apiKey, stackName, stackFile }) => {
  const httpClient = axios.create({
    baseURL: host,
    headers: {
      'X-API-Key': apiKey,
    },
  });
  const stacks = await httpClient.get('/api/stacks');
  const stack = stacks.data.find((item) => item.Name === stackName);
  const result = await httpClient.put(
    `/api/stacks/${stack.Id}?endpointId=${stack.EndpointId}`,
    {
      stackFileContent: stackFile,
      prune: true,
      pullImage: true,
    }
  );
  return result.data;
};
