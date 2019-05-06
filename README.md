This is the repository for the Chrome Dev Summit 2018 site.

## Usage

After instaling with `yarn` or `npm`, to test locally, run:

```bash
./app.js
```

To deploy:

```bash
gcloud app deploy --project chromedevsummit-site --no-promote
```

### Notes

Internally, `gcloud` is running `install` and `gcp-build`, which triggers a deploy build.
Note that dependencies must be in `dependencies`, and `devDependencies` are _not_ installed.
