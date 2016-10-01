---
layout: post
title:  "Auditing NPM Modules in Microservices"
subtitle: "Clean-up some of the mess across your repositories"
excerpt: "Where i work at [Beamery](http://beamery.com) we follow [Microservices Architecture](https://en.wikipedia.org/wiki/Microservices) and have a good 20+ git repositories. With time, these repos become bloated with old NPM modules that are either outdated or not used anymore at all. I wanted to find a way to easily audit and clean this mess."
tag:
- Node.js
- Optimization
- NPM
category: web development
---

Where i work at [Beamery](http://beamery.com) we follow [Microservices Architecture](https://en.wikipedia.org/wiki/Microservices) and have a good 20+ git repositories. With time, these repos become bloated with old NPM modules that are either outdated or not used anymore at all. I wanted to find a way to easily audit and clean this mess.

I came across the great [npm-check](https://github.com/dylang/npm-check) that:

* Tells you what's out of date.
* Provides a link to the package's documentation so you can decide if you want the update.
* Kindly informs you if a dependency is not being used in your code.
* Works on your globally installed packages too, via `-g`.
* **Interactive Update** for less typing and fewer typos, via `-u`.
* Supports public and private [@scoped/packages](https://docs.npmjs.com/getting-started/scoped-packages).
* Supports ES6-style [`import from`](http://exploringjs.com/es6/ch_modules.html) syntax.
* Upgrades your modules using your installed version of npm, including the new `npm@3`, so dependencies go where you expect them.
* Works with any public npm registry, [private registries](https://www.npmjs.com/onsite), and alternate registries like [Sinopia](https://github.com/rlidwka/sinopia).
* Does not query registries for packages with `private: true` in their package.json.
* Emoji in a command-line app, because command-line apps can be fun too.
* Works with `npm@2` and `npm@3`, as well as newer alternative installers like `ied` and `pnpm`.

To automate running `npm-check` across all of our repos and generate one coherent report, i created a simple [bash-it](https://github.com/ahmadassaf/bash-it/tree/master) function:

```bash
# Generate NPM report using the npm-check module to inspect the state of our npm modules
# The function will check if npm-check is installed and install it otherwise
# The report will be generated in the root directory and will be called npm-report.txt

bmr_generate_npm_report() {
    if command_exists npm-check ; then
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Examining NPM modules for ${magenta}'{}'${NC}' && echo '{}' >> ../npm-report.txt && npm-check >> ../npm-report.txt" \;
    else
        printf 'npm-check module was not found. Installing now:';
        npm install -g npm-check
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Examining NPM modules for ${magenta}'{}'${NC}' && echo '{}' >> ../npm-report.txt && npm-check >> ../npm-report.txt" \;
    fi
}
```

This script is executed at the root folder that contains all of your repos, will execute the `npm-check` command and aggregate the results in the `npm-report.txt` at the root directory where you executed your script.

## Auditing NPM Modules

After knowing the various modules used, i cleaned a bit my file, pasted the results in an Excel sheet, sorted the cells and created a subTotal on the count. This generated a list of all my NPM modules used and their respective count.

I hope this helps you in cleaning out your repos as well.