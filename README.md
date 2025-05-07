# Portainer Stack Deploy

Portainer-stack-deploy is a GitHub Action to deploy an updated stack to a Portainer v2 instance. This action is useful when you have a continuous deployment pipeline. The action itself is inspired by how you deploy a task definition to Amazon ECS.

This action is inspired by: [carlrygart/portainer-stack-deploy](https://github.com/carlrygart/portainer-stack-deploy)

**Currently works with Portainer API v2.**

## Input Parameters

| Input              | Description                                                                                            | Default      |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ------------ |
| portainer-host     | Portainer host, e.g. `https://myportainer.instance.com`                                                | **Required** |
| portainer-api-key  | Portainer API key for authentication                                                                   | **Required** |
| stack-name         | Name of the stack in Portainer                                                                         | **Required** |
| stack-definition   | Path to the docker-compose stack definition file from the repository root, e.g. `stack-definition.yml` | **Required** |
| template-variables | If provided, these variables will be replaced in the docker-compose file using handlebars              |              |

## Example

The example below shows how the `portainer-stack-deploy` action can be used to deploy a new version of your application to Portainer using ghcr.io.

```yaml
name: Deploy

on:
  push:
    branches:
      - master

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest
    timeout-minutes: 20

    env:
      GITHUB_REF: ${{ github.ref }}
      DOCKER_REGISTRY: ghcr.io
      DOCKER_IMAGE: github-username/my-awesome-web-app

    steps:
      - uses: actions/checkout@v2

      - name: Creating envs
        run: |
          echo "IMAGE_TAG=sha-$(git rev-parse --short HEAD)" >> $GITHUB_ENV
          echo "DOCKER_IMAGE_URI=${{ env.DOCKER_REGISTRY }}/${{ env.DOCKER_IMAGE }}" >> $GITHUB_ENV

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v1
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ github.repository_owner }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build docker image and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: ${{ env.DOCKER_IMAGE_URI }}:${{ env.IMAGE_TAG }},${{ env.DOCKER_IMAGE_URI }}:latest

      - name: Sleep for 10 seconds
        run: sleep 10s
        shell: bash

      - name: Deploy stack to Portainer
        uses: caiogomesdev/portainer-stack-deploy@v1
        with:
          portainer-host: ${{ secrets.PORTAINER_HOST }}
          portainer-api-key: ${{ secrets.PORTAINER_API_KEY }}
          stack-name: 'my-awesome-web-app'
          stack-definition: 'stack-definition.yml'
          template-variables: '{"username": "MrCool"}'
```

The `stack-definition.yml` file would be placed at the root of the repository and could look like:

```yaml
version: '3.7'

services:
  server:
    image: ghcr.io/{{username}}/my-awesome-web-app:latest
    deploy:
      update_config:
        order: start-first
```

## Development

Feel free to contribute.

### Running unit tests

```sh
npm test
```

### Build, linting check, and running tests

```sh
npm run all
```
