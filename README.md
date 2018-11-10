This is the repository for the Chrome Dev Summit 2018 site.

## Usage

After instaling with `yarn` or `npm`, to test locally, run:

```bash
./app.js
```

To deploy:

```bash
yarn gcp-build  # this should be run by gcloud, but it's not
gcloud app deploy --project chromedevsummit-site --no-promote
```
