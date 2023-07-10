---
title: 'Enabling Continuous Deployment for Jekyll'
date: '2016-02-03'
subtitle: 'Making Digital Ocean, Jekyll, Github and TravisCI all work'
summary: 'Having open sourced my blog on Github, deploying a new version of it live happens very often, and to do that manually every time is a daunting task. This post talks about my experience enabling Continuous Deployment (CD) using Github, TravisCI and my server on DigitalOcean and discuss what i tried and how i failed trying other methods'
tags: ['Jekyll', 'Continuous Deployment', 'Continuous Integration', 'Travis-CI']
category: 'development'
image: /static/images/jekyll.png
---

Static sites are great and have [various advantages](http://assaf.website/posts/power-up-a-hero-blog-with-jekyll/). However, I am aware of how much easier to use Wordpress is for lots of users. If we want to compare Wordpress’ workflow to that of a static site: even though making changes to my Jekyll site may seem rather easy to me, it really isn’t that straightforward:

- Write a post in Markdown
- Commit changes to GitHub
- Build the site on my local machine
- Manually transfer the changed files to the server

Although i have moved huge hidden parts like compressing images and compressing files and HTML to grunt tasks, there are still of steps needed to easily deploy an changes locally to the live server.

Another problem with this workflow is that the GitHub repo sometimes wouldn’t be up to date with the content I was serving, or vice versa, because had to make shortcuts here and there (edit content directly on live server, push a change locally but forget to deploy that live and so on). Basically, you want the code on GitHub to actually represent what you are serving.

All of the above have led me to set up automatic deployments to my server. This means that my workflow now just consists of creating content and committing it — the rest is done automatically. Travis CI builds the site, compresses assets, runs a few tests, and deploys it all to DigitalOcean, where a web server (Apache, Nginx) serves it.

## Failed experiments

I have my Jekyll instance running on a Digital Ocean Droplet, to configure one, you can easily follow [their great tutorial](https://www.digitalocean.com/community/tutorials/how-to-get-started-with-jekyll-on-an-ubuntu-vps).

Jekyll website has nice [articles on continuous integration](http://jekyllrb.com/docs/continuous-integration/) and [Deployment](https://jekyllrb.com/docs/deployment-methods/). In a nutshell, serving Jekyll can be done in two ways:

- It is a static website, so just have a web server like Apache running and point that to the `_site`
- Run the `jekyll serve` process on your server and proxy your web server e.g., Apache to point to your `http://0.0.0.0:4000`

> Setting 0.0.0.0 as an address to serve from is a way of saying to match all network interfaces on the machine. So if your local IP was 192.168.0.1 it would serve on both 127.0.0.1 and 192.168.0.1, computers on your local network would have access to your jekyll site. By doing `jekyll serve -H 0.0.0.0` you make sure the website is accessible externally properly.

To enable those two scenarios, i used [Codeship's](http://codeship.com) deployment pipeline that will make sure to pull the latest changes on the website and its submodules whenever a push is triggered on Github. I did that by having this line:

```shell
ssh -p $SSH-PORT-NUMBER root@SERVER-ADDRESS 'cd /www/blog; git pull origin master; git submodule foreach git pull origin master'
```

Where as you substitute the location of your github repo in the server to point correctly, e.g., `/www/blog`.

Now, after that you can have a git `post-receive` or `post-merge` hook that will run the appropriate grunt task e.g., `grunt serve` or if you running using [tmux](https://tmux.github.io/) for example and a jekyll serve process is already running, then it will pick up the change automatically and your changes will be reflected automatically.

Both files must have the correct permission and are executable:

```bash
#!/bin/bash
echo "Running Git Post Merge Hooks"
cd /var/www/blog && grunt build
```

The only thing i'd like to note if you are using the `jekyll serve` approach is that you will need to tell your webserver to proxy requests to jekyll's instance. To do that, you will need to edit `/etc/apache2/sites-available/000-default.conf` file as follows:

```shell
<VirtualHost *:*>
    ProxyPreserveHost On
    # The ServerName directive sets the request scheme, hostname and port that
    # the server uses to identify itself. This is used when creating
    # redirection URLs. In the context of virtual hosts, the ServerName
    # specifies what hostname must appear in the request's Host: header to
    # match this virtual host. For the default virtual host (this file) this
    # value is not decisive as it is used as a last resort host regardless.
    # However, you must set it for any further virtual host explicitly.
    #ServerName www.example.com

    ServerAdmin webmaster@localhost
    DocumentRoot /www/blog

    # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
    # error, crit, alert, emerg.
    # It is also possible to configure the loglevel for particular
    # modules, e.g.
    #LogLevel info ssl:warn

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    ProxyPass / http://0.0.0.0:4000/
    ProxyPassReverse / http://0.0.0.0:4000/

    ServerName localhost
    # For most configuration files from conf-available/, which are
    # enabled or disabled at a global level, it is possible to
    # include a line for only one particular virtual host. For example the
    # following line enables the CGI configuration for this host only
    # after it has been globally disabled with "a2disconf".
    #Include conf-available/serve-cgi-bin.conf
</VirtualHost>
```

For various reason that i am still not sure what, this process failed to me as the website was not updating as i was pushing changes. For example, when i push to Github, the build triggers and the build is successful and is able to pull the latest for the main repo and the submodule but the git hooks seem to never be fired. However, I have tried to pull manually from the repo and indeed the hooks were triggered then.

What i tried as well was creating a new script called `deploy.sh` which will be called as well as part of the codeship custom script so that the script is:

```bash
ssh -root@SERVER 'cd /var/www/blog; npm install; git pull origin master; git submodule foreach git pull origin master; bash /var/www/blog/deploy.sh'
```

And the `deploy.sh` has the correct permissions and is:

```bash
#!/usr/bin/bash

grunt build && echo "blog deployed via hook on: `git log -1`" >> deployment.txt
```

Where the file `deployment.txt` will contain a log of the latest commit messages that were deployed. Again, this method failed as well.

I have tried to add a remote in my web server called `production` so that i can push directly to my server with git push production master .. the data is pushed indeed but i still dont get the hooks to be run at all.

As a result of my failed attempts, i had to try another approach and i decided to go and try [TravisCI](travis-ci.org).

# Going the Travis way

<img src="/static/images/CD.jpg"/>

> Image Reference: [Website Continuous Integration with Travis CI, Jekyll, gulp, and GitHub](https://cesiumjs.org/2016/02/03/Cesium-Website-Continuous-Integration/)

The first step to achieving this new workflow was to have rigorous rules set up on the server. No more deployments as root, from now on we’re doing things correctly.

## Setting up the server

### Create a new user with restricted access

We need to create a new user with limited permissions: the user will be only allowed to operate in the destination where you have blog in the server e.g., `/var/www/blog`. This new user will also be used by Travis CI to log in, and we’ll give it ownership of our live directory.

```bash
$ adduser travis
$ chown -R travis:travis /var/www/blog
```

### Set up public key authentication

For Travis CI to log in to the server, we’ll set up public key authentication. To do this, on your **local machine**, you should run:

```bash
ssh-keygen
```

Which should output something like this:

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/USNER_NAME/.ssh/id_rsa): deploy-key
```

It will also ask for a passphrase; leave that blank. This process should leave you with two files in your `.ssh` folder: `deploy-key`, which is your private key (this is like a password, so protect it at all times!) and `deploy-key.pub`, your public key.

Now your server needs to know your public key for the correct user so that you can log in using your private key. SSH to your **live server** and:

$ su - travis

Then, we’ll create a `.ssh` directory in the home directory, and an `authorized_keys` file inside of it:

```bash
$ mkdir .ssh
$ chmod 700 .ssh
$ vi .ssh/authorized_keys
```

At this point, you can paste in the contents of your `deploy-key.pub` file. Now, we’ll just restrict the permissions to the `authorized_keys` file:

```bash
$ chmod 600 .ssh/authorized_keys
```

### Create a remote

We want now to be able to push to our server the same how we push to Github. Now, to understand how we will structure our folders, we need to remember how Jekyll compiles and generates our site. Basically, Jekyll will build based on your template and configurations the final "static" version of the website and have that in the `_site` folder. This means that what you should be serving is only that folder and we really don't care about all the other stuff.

I have created a separate hidden folder called `.build` which will contain all the site to build. I then create a subfolder for each remote repository. For example, for my blog i have created an empty Git repo in it `mkdir /var/www/.build/blog` and then initialize the git repo there with `cd /var/www/.build/blog && git init --bare`.

We need to make sure that we have correct access permissions and ownership for our repositories.

```bash
chown -R travis /var/www/.build/
```

Now we need to add a `post-receive` hook, which is a list of commands to run once the remote has received a push:

```bash
$ cd hooks
$ vi post-receive
```

Now, i need to tell Git where to find my main `_site` or the content that will be served live. For me, i have set up my server to serve my content from `var/www/blog`. So, in my git hook i have:

```bash
#!/bin/sh
git --work-tree=/var/www/blog --git-dir=/var/www/.build/blog checkout -f
```

The post-receive hook will just need to be executable, so that it actually can do its job:

```bash
$ chmod +x post-receive
```

## Setting up Travis CI

Everything now is ready for Travis to start doing its magic. However, we have a slight problem of granting Travis access to the private key. If our Github repo is private this can be a solution although this is definitely not a recommended approach.

It turns out that Travis has a [command-line utility to encrypt files](https://docs.travis-ci.com/user/encryption-keys/). Using this, it’s safe to upload the key publicly to GitHub, and Travis CI can still use it. You’ll need to log in first though, because it will have to add two private environment variables to your Travis account, so that it can decrypt the encrypted private key later on (yeah, we’re getting into some pretty heavy crypto setups now, but it’s the best we can do).

Travis executes commands based on instructions defined in `.travis.yml` file. We need to create such a file in your repository:

```bash
touch .travis.yml
```

You’ll need to copy your private key file (deploy-key) to your local repository. Then, we’ll install the Travis command line utility, log in, and encrypt the file:

```bash
gem install travis
travis login
travis encrypt-file deploy-key --add
```

The last command will create an encrypted copy of your deployment key, `deploy-key.enc`. It will also add a few lines to your `.travis.yml`

```yaml
before_install:
  - openssl aes-256-cbc -K $encrypted_22009518e18d_key -iv $encrypted_22009518e18d_iv -in deploy-key.enc -out deploy-key -d
```

> You should immediately remove the unencrypted private key from your repo, so that you don’t risk uploading it to GitHub. There are bots out there that do nothing but analyze GitHub commits to find login information, and they will compromise your server in a matter of seconds if you accidentally disclose the key.

### Instructing Travis with `.travis.yml`

All we need to do now is to tell Travis how to build, test and deploy the site. For that purpose, we have the `.travis.yml`, which acts as a list of instructions for Travis.

Right now, my .travis.yml file looks like this:

```yaml
language: ruby
cache:
  bundler: true
  directories:
    - node_modules
rvm:
  - 2.2
env:
  global:
    - NOKOGIRI_USE_SYSTEM_LIBRARIES=true
addons:
  ssh_known_hosts:
    - <SERVER_IP_ADDRESS>
    - <SERVER_IP_ADDRESS>:<SERVER_PORT_NUMBER>
sudo: false
before_install:
  - bundle install
  - nvm install 4.2.2
  - nvm use 4.2.2
  - npm install grunt-cli -g
  - npm install
  - bash _scripts/install.sh
before_script:
  - echo -e "Host <SERVER_IP_ADDRESS>\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
  - echo -e "Host <SERVER_IP_ADDRESS>:<SERVER_PORT_NUMBER>\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
script:
  - bash _scripts/build.sh
  - bash _scripts/test.sh
after_success:
  - bash _scripts/deploy.sh
notifications:
  slack: <SLACK_CHANNEL>:<TOKEN>
```

> Note that i have masked various things like server address and slack token for security reasons. The variables `<SERVER_IP_ADDRESS>`, `<SERVER_PORT_NUMBER>`, `<SLACK_CHANNEL>` and `<TOKEN>` have to be filled with your specific details

There are [various configurations that we can set up to customize the build](https://docs.travis-ci.com/user/customizing-the-build). Our configuration file defines Ruby as the main language, and version 2.2 as the version that should be installed on Travis with `rvm`.

We define as well what files and folders to cache. This is of great important as it speeds up our build significantly. [Caches](https://docs.travis-ci.com/user/caching) lets Travis CI store directories between builds, which is useful for storing dependencies that take longer to compile or download. For us, we cache the dependencies for Jekyll with `bundler` and all of our `node_modules` as well.

We also add our server IP address as well as our SSH IP address (i did this as i have a different SSH port number that the default one) as known hosts so that I don’t get a warning when I try to connect to it.

I reference a few bash scripts to run at various stages of the build process. These scripts have been placed in the `_scripts` directory, which won’t be built by Jekyll since its name starts with an underscore.

#### `before_install`

Before starting any of the process we need to make sure that we have set up our environment by installing `nvm`, `Node.js` and all of our global `npm` modules and `gem` files. Necessary files and folders will be brought up from the cache when needed. Afterwards, we execute the `install.sh` file which contains:

```bash
#!/bin/bash
set -x # Show the output of the following commands (useful for debugging)

# Import the SSH deployment key
openssl aes-256-cbc -K $encrypted_7bbee2d42c21_key -iv $encrypted_7bbee2d42c21_iv -in deploy-key.enc -out deploy-key -d
rm deploy-key.enc # Don't need it anymore
chmod 600 deploy-key
mv deploy-key ~/.ssh/id_rsa
```

The `openssl` command decrypts the encrypted private key. I’ve actually just copy-pasted what travis encrypt-file added to `.travis.yml` earlier on.

Also, note that I’m moving the key to the `.ssh` directory under the name `id_rsa`. This is the default name for the key Git will look for when pushing to the server. It makes our lives a bit easier to place it there, under that name, since we won’t need to specify what key should be used later on.

#### before_script

A common problem i hit when trying to connect with SSH to my server was having SSH read properly from the `known_hosts` whenever i try to connect. However, there seemed to be a problem that i could not wrap my head around until i came across [this article](http://bencane.com/2013/07/22/ssh-disable-host-checking-for-scripts-automation/). As a result, i disable `StrictHostKeyChecking` to enable Travis to log in properly with these two commands.

#### build

The build is straightforward for me as i have everything configured in Grunt. My `build.sh` file looks like:

```bash
#!/bin/bash
set -x
# Build the site with Jekyll
grunt build
```

#### test

Testing is done with [HTML-Proofer](https://github.com/gjtorikian/html-proofer). Since it is in my Gemfile, Travis automatically installs it for us. My test file is configured as:

```bash
#!/bin/bash
set -x

bundle exec htmlproofer _site --url-ignore "/assaf.website|github.com/" --only-4xx --http-status-ignore "403" --check-html --check-favicon
```

In this one command, I’m validating HTML, checking that no external link returns a 400-error (ignoring any redirects as they are fine), and that the favicon is present and referenced on every page. I ignore my blog address url and Github's with `_site --url-ignore "/assaf.website|github.com/"` as whenever you’re adding a new post, it’ll return an error because the post isn’t online yet (i do that also for Github as i link as well the posts to my Github repository).

#### deploy

At this point, we want to deploy what we’ve just built. That’s why we’re going to push from a new repo in our `_site` folder.

```bash
#!/bin/bash
set -x

# Initialize a new git repo in _site, and push it to our server.
cd _site
git init

git remote add deploy "ssh://travis@<IP_ADDRESS>:<PORT_NUMBER>/var/www/.build/blog"
git config user.name "Travis CI"
git config user.email "ahmad.a.assaf+travisCI@gmail.com"

git add .
git commit -m "Deploy"
git push --force deploy master
```

We’re adding our remote with the deployment username that we have configured earlier, on the path where our `.git` directory is. We commit everything and push it using the `--force`. This is necessary, since this new repo isn’t strictly linked to our remote; it doesn’t have the same history or anything. This argument just tells Git to ignore that fact.

Feel free to ask or check out my [GitHub repo](https://github.com/ahmadassaf/blog-core) to check how everything is set up in action !

## Relevant References:

- [Website Continuous Integration with Travis CI, Jekyll, gulp, and GitHub](https://cesiumjs.org/2016/02/03/Cesium-Website-Continuous-Integration/)
- [Travis CI deployments to DigitalOcean](https://kjaer.io/travis/)
- [How To Set Up Apache Virtual Hosts on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts)
