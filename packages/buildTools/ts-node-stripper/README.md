# TS-node stripper

Program to remove unused files from ts-node installation to make the package smaller.

# Install

- Packages to use this stripper will be installed with the rest of the monorepo with `rush update` ran in the root folder of this monorepo.

# Create TS-node installation

```bash
cd ts-node-installation
npm i --omit=dev
```

# Usage

```bash
pnpm strip-ts-node
```
