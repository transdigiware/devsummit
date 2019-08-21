This subfolder contains a Google App Engine app that is specific to Chrome Dev Summit.

`developer.chrome.com` is a GAE app that can reverse proxy to other GAE apps (and only GAE apps!). As such, `/devsummit` points at _this_ app that reverse-proxies to Firebase. Is this bad? Yes, absolutely. But our technical constraints led us here.
