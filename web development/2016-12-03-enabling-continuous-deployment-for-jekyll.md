---
layout: post
title:  "Enabling Continuous Deployment for Jekyll"
subtitle: "Making Digital Ocean, Jekyll, Github and TravisCI all work"
excerpt: "Having open sourced my blog on Github, deploying a new version of it live happens very often, and to do that manually every time is a daunting task. This post talks about my experience enabling Continuous Deployment (CD) using Github, TravisCI and my server on DigitalOcean"
tag:
- Jekyll
- Continuous Development
category: web development
image: /images/posts/jekyll.png
---

**Continuous Delivery** is a series of practices designed to ensure that code can be rapidly and safely deployed to production by delivering every change to a production-like environment and ensuring business applications and services function as expected through rigorous automated testing.

**Continuous Deployment (CD)** is the next step of continuous delivery: Every change that passes the automated tests is deployed to production automatically. Continuous deployment should be the goal of most companies that are not constrained by regulatory or other requirements.

{% capture images %}
    /images/posts/CD.gif
{% endcapture %}
{% include partials/post/gallery.html images=images caption="Continuous Delivery vs. Continuous Deployment" cols=1 %}

I have my website and blog built with Jekyll, I have my posts defined as a submodule inside the main repository.

My workflow is that i either update the core of the website which is the main "code" files or update inside the submodule repo which contains the blog posts.

I would like that whenever there is a change in the main repo (which also includes a change in the submodule) that i trigger a jekyll build. My jekyll build is not triggered by a simple jekyll build but rather in a bit more complex grunt build process using the grunt build command

I have tried to achieve CI/CD using the following methods but none seem to work:

1) Setting up Codeship to deploy with a custom script being:

ssh root@SERVER 'cd /var/www/blog; npm install; git pull origin master; git submodule foreach git pull origin master;

Added git hooks for post-receive and post-merge. Both files have the correct permission and contain:

#!/bin/bash
echo "Running Git Post Merge Hooks"
cd /var/www/blog && grunt build
Now when i push to github, the build triggers and the build is successuful and is able to pull the latest for the main repo and the submodule but the git hooks seem to never be fired.

I have tried to pull manually from the repo and indeed the hooks were triggered then
2) I have created a new script called deploy.sh which will be called as well as part of the codeship custom script so that the script is:

ssh -root@SERVER 'cd /var/www/blog; npm install; git pull origin master; git submodule foreach git pull origin master; bash /var/www/blog/deploy.sh'

And the deploy.sh has the correct permissions and is:

#!/usr/bin/bash

grunt build && echo "blog deployed via hook on: `git log -1`" >> deployment.txt
3) I have tried to add a remote in my webserver called production so that i can push directly to my server with git push production master .. the data is pushed indeed but i still dont get the hooks to be run at all

I really aprpeciate any help at this point.