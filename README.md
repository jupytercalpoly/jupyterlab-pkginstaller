# Meet pkgmanager 👋

**pkgmanager** is s a JupyterLab UI extension that installs the packages you need for your active kernel. ✨
You can look for a package in the search bar and install it with just a button-click.

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install pkgmanager
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```
