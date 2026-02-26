<!-- TEXT_SECTION:header:START -->
<p align="center">
  <a href="https://linear.app" target="_blank" rel="noopener noreferrer">
    <img width="64" src="https://raw.githubusercontent.com/linear/linear/master/docs/logo.svg" alt="Linear logo">
  </a>
</p>
<h1 align="center">
  Linear API
</h1>
<h3 align="center">
  The purpose-built tool for planning and building products
</h3>
<p align="center">
  Streamline issues, projects, and product roadmaps<br/>
  with the system for modern software development.
</p>
<p align="center">
  <a href="https://github.com/linear/linear/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Linear is released under the MIT license." />
  </a>
  <a href="https://github.com/linear/linear/actions/workflows/build.yaml">
    <img src="https://github.com/linear/linear/actions/workflows/build.yaml/badge.svg" alt="Build github action status." />
  </a>
  <a href="https://github.com/linear/linear/actions/workflows/release.yaml">
    <img src="https://github.com/linear/linear/actions/workflows/release.yaml/badge.svg" alt="Release github action status." />
  </a>
  <a href="https://github.com/linear/linear/actions/workflows/schema.yaml">
    <img src="https://github.com/linear/linear/actions/workflows/schema.yaml/badge.svg" alt="Schema github action status." />
  </a>
  <a href="https://github.com/linear/linear/actions/workflows/dependencies.yaml">
    <img src="https://github.com/linear/linear/actions/workflows/dependencies.yaml/badge.svg" alt="Dependencies github action status." />
  </a>
</p>
<!-- TEXT_SECTION:header:END -->

<br/>

## What is this?

This monorepo contains the source for Linear's open source developer tooling:

- **[@linear/sdk](./packages/sdk)** — A type-safe TypeScript client for the [Linear GraphQL API](https://developers.linear.app/docs), auto-generated from the production schema
- **[@linear/import](./packages/import)** — A CLI for importing issues into Linear from GitHub, Jira, Asana, Trello, and other platforms
- **Code generation plugins** (`codegen-doc`, `codegen-sdk`, `codegen-test`) — Custom [GraphQL Code Generator](https://graphql-code-generator.com/) plugins that produce the typed SDK, its fragments/documents, and tests

For documentation on using the SDK or API, visit [**developers.linear.app**](https://developers.linear.app/docs).

<!-- TEXT_SECTION:contribute:START -->

### Structure

This monorepo uses `pnpm` workspaces to manage and publish packages.

Generated code uses file prefix `_generated` and should never be manually updated.

Open source packages:
- [sdk](https://github.com/linear/linear/tree/master/packages/sdk/README.md) - The Linear Client SDK for interacting with the Linear GraphQL API
- [import](https://github.com/linear/linear/tree/master/packages/import/README.md) - Import tooling for uploading from other systems
- [codegen-doc](https://github.com/linear/linear/tree/master/packages/codegen-doc/README.md) - GraphQL codegen plugin to generate GraphQL fragments and documents
- [codegen-sdk](https://github.com/linear/linear/tree/master/packages/codegen-sdk/README.md) - GraphQL codegen plugin to generate Typescript SDK from fragments and documents
- [codegen-test](https://github.com/linear/linear/tree/master/packages/codegen-test/README.md) - GraphQL codegen plugin to generate a jest test for the Typescript SDK

### Get Started

Make sure you have Node 18+ and Corepack enabled (`corepack enable`).

```shell
# install dependencies
pnpm install

# build all packages
pnpm build

# test all packages
pnpm test

# update the schema from the production API
pnpm schema

# create changeset for generating CHANGELOG.md
pnpm changeset
```

### Plugin Flow

1. The [@linear/codegen-doc](https://github.com/linear/linear/tree/master/packages/codegen-doc/README.md) plugin is used by [codegen.doc.yml](https://github.com/linear/linear/tree/master/packages/sdk/codegen.doc.yml) to generate [fragments and documents](https://github.com/linear/linear/tree/master/packages/sdk/src/_generated_documents.graphql)
2. The [@linear/codegen-sdk](https://github.com/linear/linear/tree/master/packages/codegen-sdk/README.md) plugin is used by [codegen.sdk.yml](https://github.com/linear/linear/tree/master/packages/sdk/codegen.sdk.yml) to generate the typed [Linear SDK](https://github.com/linear/linear/tree/master/packages/sdk/src/_generated_sdk.ts)
3. The [@linear/codegen-test](https://github.com/linear/linear/tree/master/packages/codegen-test/README.md) plugin is used by [codegen.test.yml](https://github.com/linear/linear/tree/master/packages/sdk/codegen.test.yml) to generate a typed [jest test](https://github.com/linear/linear/tree/master/packages/sdk/src/_tests/_generated.test.ts)

<br/>
<!-- TEXT_SECTION:contribute:END -->

<!-- TEXT_SECTION:license:START -->
## License

<br/>

Licensed under the [MIT License](./LICENSE).
<!-- TEXT_SECTION:license:END -->
