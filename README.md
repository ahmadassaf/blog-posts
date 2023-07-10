## Ahmad Assaf's Blog Posts

This repository contains the blog posts that i post to my [personal blog](http://assaf.website/blog). I would like that people contribute to them by submitting pull requests and issues in order to make sure the content is accurate, rich and appealing.

## How to contribute

* Make sure you have a [GitHub account](https://github.com/signup/free)
* Submit a ticket for your issue, assuming one does not already exist.
  * Clearly describe the issue or correction you would like to be made
  * If the issue is to the appearence or functionality of the website/blog clearly describe the issue including steps to reproduce when it is a bug.
* Fork the repository on GitHub

## Making Changes

* Create a topic branch from where you want to base your work.
  * This is usually the master branch.
  * To quickly create a topic branch based on master; `git checkout -b fix/master/my_contribution master`. Please avoid working directly on the `master` branch.
* Make commits of logical units.
* Check for unnecessary whitespace with `git diff --check` before committing.
* Make sure your commit messages are in the proper format.
* Run the grunt build and make sure that the tests on Travis and Codeship succeed.
