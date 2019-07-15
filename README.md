```
npm i
npm run build
```

# Project structure

The `src` folder uses [11ty](https://www.11ty.io), with the following differences:

## CSS modules

CSS files are processed as [CSS Modules](https://github.com/css-modules/css-modules). Within a template, reference classnames like this:

```njk
{% className cssPath, class %}
```

…and it will output the transformed class name. Eg:

```njk
{% set talkCSS = "/_includes/talk/style.css" %}
<h2 class="{% className talkCSS, 'talk-header' %}">Building offline-first apps</h2>
<div class="{% className talkCSS, 'talk-description' %}">
  …
</div>
```

In the example above, `set` is used to avoid repeating the path to the CSS.

## Assets

In templates, references assets via `confboxAsset('/path/to/asset.jpg')`. This will be replaced with the hashed name of the asset.

```njk
<link rel="stylesheet" href="confboxAsset('/_includes/talk/style.css')">
```

## Scripts

In templates, references scripts via `confboxScript('/path/to/script.js')`. This will be replaced with the hashed name of the script, and scripts will be optimised as a bundle.

```njk
<script defer src="confboxScript(/_includes/main/script.js)"></script>
```
