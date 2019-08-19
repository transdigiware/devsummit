```
npm i
npm run build # (node 12+ required)
```

The `src` folder uses [11ty](https://www.11ty.io).

# Configs

`/confbox.config.js` allows you to configure the start, end, and timezone of the conference.

# Data

All templates have access to the following:

- `conf.utcOffset` - The offset of the conference from the UTC timezone in milliseconds.
- `conf.start` - Start of the conference as a timestamp.
- `conf.end` - End of the conference as a timestamp.

# Helpers

## `{% className cssPath, class %}`

CSS files are processed as [CSS Modules](https://github.com/css-modules/css-modules). Within a template, reference classnames like this:

```njk
{% className cssPath, class %}
```

…and it will output the transformed class name. Eg:

```njk
{% set css = "/_includes/talk/style.css" %}
<h2 class="{% className css, 'talk-header' %}">Building offline-first apps</h2>
<div class="{% className css, 'talk-description' %}">
  …
</div>
```

In the example above, `set` is used to avoid repeating the path to the CSS.

## `{% css page, cssURL %}`

This will output a `<link>` pointing to the `cssURL` unless it's been included already for the current page. This means you can use an include multiple times without loading the CSS multiple times.

- `page` - This is the page object available in every template.
- `cssURL` - CSS url.

Example:

```njk
{% set css = "/_includes/talk/style.css" %}
{% css page, css %}
```

## `confboxAsset(url)`

In templates and CSS, references assets via `confboxAsset('/path/to/asset.jpg')`. This will be replaced with the hashed name of the asset.

```njk
<link rel="stylesheet" href="confboxAsset('/_includes/talk/style.css')">
```

```css
.whatever {
  background: url('confboxAsset(asset.jpg)');
}
```

Assets ending `.js` will be bundled together using Rollup.

## `{% confDate date, format %}`

This will take a `date` and format it for the timezone of the conference (as set in `/confbox.config.js`).

- `date` - The date to display. This can be a `Date` object or a timestamp.
- `format` - A formatting string as used by [date-and-time](https://www.npmjs.com/package/date-and-time#formatdateobj-formatstring-utc).

```njk
<p>The conference starts {% confDate conf.start, 'MMMM DD' %}</p>
```

## `{% isoDate date %}`

Returns an ISO 8601 version of a date. This is suitable for `<time datetime>` and other machine-readable formats like iCal.

- `date` - The date to display. This can be a `Date` object or a timestamp.

## Login

The login system currently relies on Firebase Realtime Database and
Firebase Functions.

For development with functions enabled, do the following:

```
$ cd functions
$ npm install
$ npm run build
$ cd ..
$ npm run loadsecrets
$ npm run serve:firebase
```
