---
layout: post
title:  "Auditing NPM Modules in Microservices"
subtitle: "Clean-up some of the mess across your repositories"
excerpt: "Where i work at Beamery we follow Microservices Architecture and have a good 20+ git repositories. With time, these repos become bloated with old NPM modules that are either outdated or not used anymore at all. I wanted to find a way to easily audit and clean this mess."
tag:
- Node
- Optimization
- NPM
category: programming
image: /images/posts/npm.png
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

To automate running `npm-check` across all of our repos and generate one coherent report, i created a simple [bash-it](https://github.com/ahmadassaf/bash-it/tree/master) plugin. The plugin in its core does:

```bash
# Generate NPM report using the npm-check module to inspect the state of our npm modules
# The function will check if npm-check is installed and install it otherwise
# The report will be generated in the root directory and will be called npm-report.txt

generate_npm_report() {
    if command_exists npm-check ; then
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Examining NPM modules for '{}'' && echo '{}' >> ../npm-report.txt && npm-check >> ../npm-report.txt" \;
    else
        printf 'npm-check module was not found. Installing now:';
        npm install -g npm-check
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Examining NPM modules for '{}'' && echo '{}' >> ../npm-report.txt && npm-check >> ../npm-report.txt" \;
    fi
}

# Some helper functions to check if a certain command exists
command_exists () {
    type "$1" &> /dev/null ;
}
```

This script is executed at the root folder that contains all of your repositories, will execute the `npm-check` command and aggregate the results in the `npm-report.txt` at the root directory where you executed your script.
The script also checks first if the `npm-check` command exists or we need to install it via an `npm install -g npm-check`.

To go step by step inside of the main function:

 - `find . -maxdepth 1 -type d \( ! -name . \)`: Will find all the directories within one level down of the current folder
 - `printf 'Examining NPM modules for '{}''` will just print out a message indicating which folder we are currently examining
 - `echo '{}' >> ../npm-report.txt` will print out the folder name examined in the output file `npm-report.txt`
 - `npm-check >> ../npm-report.txt` this will execute the `npm-check` command and pipe out the result into the output file

## Auditing NPM Modules

After knowing the various modules used, i cleaned a bit my file, pasted the results in an Excel sheet, sorted the cells and created a subTotal on the count. This generated a list of all my NPM modules used and their respective count.

## Cleaning out unused NPM modules

The previous function is good at giving us an idea of what modules are being used and in what frequency. However, we might have a bunch of unused modules that were left over old code and will just increase the size of our containers with no actual use.

We can easily clean out those modules by taking advantage of the [npm-clean](https://github.com/afc163/npm-clean) and plug that in a similar wrapper as the function above:

```bash
# Clean unused NPM modules from each repository
# The function will check if npm-clean is installed and install it otherwise

clean_npm_modules() {

    if command_exists npm-clean ; then
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Cleaning NPM modules for '{}'' && echo '{}' >> ../npm-clean-report.txt && npm-clean >> ../npm-clean-report.txt" \;
    else
        printf 'npm-check module was not found. Installing now:';
        npm install -g npm-clean
        find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && printf 'Cleaning NPM modules for '{}'' && echo '{}' >> ../npm-clean-report.txt && npm-clean >> ../npm-clean-report.txt" \;
    fi
}

# Some helper functions to check if a certain command exists
command_exists () {
    type "$1" &> /dev/null ;
}
```

I hope this helps you in cleaning out your repositories as well.