# ponces.dev

Alberto Ponces’s personal site. Experience, projects, skills, education, and
contact information live directly on the homepage—there is no downloadable CV.

## Preview the new homepage

Run `python3 -m http.server 4173` from this directory, then visit
<http://localhost:4173>. No Node.js dependencies or build step are required.

## Edit the site

- `index.html`: content, social links, and search/social metadata.
- `assets/site.css`: responsive layout, light/dark themes, and print styles.
- `assets/site.js`: optional theme preference and current copyright year.
- `assets/images/profile.jpg`: portrait.
- `CNAME`: custom GitHub Pages domain; preserved as `ponces.dev`.

The homepage is plain HTML without Jekyll front matter, so GitHub Pages copies
it as-is. Existing Jekyll pages and theme files remain untouched for compatibility.
The site follows the system color theme until the visitor makes a choice.
Core content and navigation work without JavaScript. Fonts use Google Fonts
with local system fallbacks.

To publish, review the changes and push them to the repository’s `gh-pages`
branch using the existing GitHub Pages setup. Removing the PDF stops serving it
in future deployments; it does not remove copies from Git history or caches.

---

## Legacy theme documentation

The following documentation belongs to the original Indigo theme, which is
still used by the legacy Jekyll pages, not by the new homepage.

<p align="center">
    <h2 align="center">Indigo Minimalist Jekyll Template - <a href="https://sergiokopplin.github.io/indigo/">Demo</a></h2>
</p>

<p align="center">This is a simple and minimalist template for Jekyll for those who likes to eat noodles.</p>

***

<p align="center">
    <b><a href="README.md#what-has-inside">What has inside</a></b>
    |
    <b><a href="README.md#setup">Setup</a></b>
    |
    <b><a href="README.md#settings">Settings</a></b>
    |
    <b><a href="README.md#how-to">How to</a></b>
</p>

<p align="center">
    Light and Dark themes.
</p>

<p align="center">
    <img src="https://raw.githubusercontent.com/sergiokopplin/indigo/gh-pages/assets/screen-shot.png" />
</p>

## What has inside

- [Jekyll](https://jekyllrb.com/), [Sass](https://sass-lang.com/) ~[RSCSS](https://rscss.io/)~ and [SVG](https://www.w3.org/Graphics/SVG/);
- Google Speed: [98/100](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fsergiokopplin.github.io%2Findigo%2F);
- No JS. :sunglasses:

## Setup

0. :star: to the project. :metal:
1. Fork the project [Indigo](https://github.com/sergiokopplin/indigo/fork)
2. Edit `_config.yml` with your data (check <a href="README.md#settings">settings</a> section)
3. Write some posts :bowtie:

If you want to test locally on your machine, do the following steps also:

1. Install [Jekyll](https://jekyllrb.com) and [Bundler](https://bundler.io/).
2. Clone the forked repo on your machine
3. Enter the cloned folder via terminal and run `bundle install`
4. Then run `bundle exec jekyll serve`
5. Open it in your browser: `http://localhost:4000`
6. Do you want an admin panel to edit your posts? You can install this plugin [jekyll-admin](https://jekyll.github.io/jekyll-admin/).

## Settings

You must fill some informations on `_config.yml` to customize your site.

```
name: John Doe
bio: 'A Man who travels the world eating noodles'
picture: 'assets/images/profile.jpg'
...

and lot of other options, like width, projects, pages, read-time, tags, related posts, animations, multiple-authors, etc.
```

## How To?

Check the [FAQ](./FAQ.md) if you have any doubt or problem.

---
## License

[MIT](https://kopplin.mit-license.org/) License © Sérgio Kopplin
