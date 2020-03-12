```
               _
   _________  (_)___  _____
  / ___/ __ \/ / __ \/ ___/
 (__  ) / / / / /_/ (__  )
/____/_/ /_/_/ .___/____/
            /_/
```

> Easily stash `snip`pet`s` of text and invoke them when needed

## Install

```bash
npm install -g snips-cli
```

## Examples

```bash
snips                           # with no arguments it will just list all your snips.
snips list                      # lists all your snips.
snips new <snip-name>           # create <snip-name> snip
snips edit <snip-name?>         # edit <snip-name> snip, fuzzy completion if snip-name is skipped
snips copy <snip-name?>         # Copies content of the snip to the clipboard, fuzzy completion if snip-name is skipped
```

## Behind the scenes
All snips are stored in `~/.snips` directory. You can play around with them to your hearts content without adversely affecting the functioning of `snips`.

`snips` looks for the `$EDITOR` global variable, and uses the defined `$EDITOR`.

## Recipes
I've refrained from reinventing the wheel and overloading `snips` with unnecessary features. Here are a couple of recipes that I find work well with snips.

**Search Snippets**

Use grep or ag.

    grep <search-term> ~/.snips
    ag <search-term> ~/.snips

**Fuzzy Search snippet-names**

copy and edit support fuzzy completion out of the box

    snips copy
    snips edit

**Use snips in multiple machines**

Backup `.snips` in `git`.

## TODO

- [x] collect metadata using yaml-frontmatter.
- [ ] edit metadata.
- [ ] search metadata.
- [ ] gist support.

## Credits
I've tried to mimic most of the features of [sheets](https://github.com/oscardelben/sheet), and add a couple on top. While `sheets` is awesome, I didn't know `ruby` enough to directly hack on it.

## LICENSE
MIT © [Srijan R Shetty](http://srijanshetty.in)
