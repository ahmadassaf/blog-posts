---
layout: post
title:  "Power-up a hero blog with Jekyll"
subtitle: "Setting up a modular Jekyll blog with Continuous Integration and Deployment"
excerpt: "Having had my blog on WordPress for a while now, i thought i need a lighter platform especially that my blog content is very lightweight and i don't really need a fully fledged CRM. Another reason to move away from WordPress was the need to have a collaborative effort and to write posts in Markdown. I have finally decided on Jekyll for its simplicity and extensibility"
tag:
- Jekyll
category: web development
featured: true
image: /images/posts/jekyll.png
---

Having had my blog on WordPress for a while now, i thought i need a lighter platform especially that my blog content is very lightweight and i don't really need a fully fledged CRM. Another reason to move away from WordPress was the need to have a collaborative effort and to write posts in Markdown. I have finally decided on [Jekyll](https://jekyllrb.com/) for its simplicity and extensibility.

Jekyll takes your content written in Markdown, passes it through your templates and spits it out as a complete static website, ready to be served.

Jekyll uses the Liquid templating language to process templates. There are two important things to know about using Liquid.
First, a YAML front-matter block is at the beginning of every content file. It specifies the layout of the page and other variables, like title, date and tags. It may include custom page variables that you’ve created, too.
Liquid template tags are used to execute loops and conditional statements and to output content.

## Directory Structure


 - **_data**: In addition to the built-in variables in the main config, you can specify your own custom data that can be accessed from here
 - **_includes**: Snippets of code that can be used throughout your templates
 - **_layouts**: The main layouts defined for various pages and posts
 - **_pages**: Any special pages that are not of type posts
 - **_plugins**: Any defined ruby plugins if you have any
 - **_posts**: The main folder than contains the markdown posts
 - **_script**: Contains any additional scripts you would like to run and define in your config file
 - **assets**: The main container for .js,scss,css,etc. files. Also contains any font file definitions
 - **images**: The main images folder
 - **index.md**: The main landing page/homepage
 - **posts**: This is an extra page defined with a permalink and will act as my paginated archive

```
├── _data # Custom data files
├── _includes # Snippets of code that can be used throughout your templates
├── _layouts # The main layouts defined for various pages and posts
├── _pages # Any special pages that are not of type posts
├── _plugins # Any defined ruby plugins if you have any
├── _posts # The main folder than contains the markdown posts
├── _script # Contains any additional scripts you would like to run and define in your config file
├── assets # The main container for .js,scss,css,etc. files. Also contains any font file definitions
│   ├── _sass
│   ├── css
│   ├── fonts
│   └── js
├── images
├── posts # This is an extra page defined with a permalink and will act as my paginated archive
└── _site # This is the destination of Jekyll build process | The static website
```

## Files you need to know about !

 - **_config.dev.yml**: Jekyll configuration overrides for local dev environment
 - **_config.yml**: The default jekyll configuration file
 - **posts.json**: JSON file containing data
 - **gruntfile.js**: The main build file using Grunt.js

## Configuration

`_config.yml` is [Jekyll’s configuration file](https://jekyllrb.com/docs/configuration/), containing all of the settings for your Jekyll website. The great thing about _config.yml is that you can also specify all of your own variables here to be pulled in via template files across the website. Some notable configurations are:

 - **url**: This is the main address of the blog/website which is also accessed by the `{{site.url}}` liquid variable
 - **github-repo**: This points to the Github repository where the posts are being saved. This is used in the post header to create the "contribute to this post" link.
 - **background.default-post**: This is the default image used in the generation of the post preview if there was no image post defined.
 - **permalink**: This defines the structure of the URL for the posts
 - **sass**: Defines the location of the preprocessing files
 - **google-analytics**: This is the Google Analytics tracking information that will be picked up by the `_includes/scripts.html` to inject the Google Analytics script.
 - **featured**: This is an initialization of an empty array that will be used to save featured articles
 - **disquss.shortname**: This is Disquss website shortname which is used to inject `_includes/partials/post/comments.html`

## Posts & Pages

There are two main types of web pages that i am using; the default `post` type which goes to the `_posts` and converts any `.md` file into an html page and a `page` which is rendered based on the templates defined in `/_pages`.

What is notable about a **page** is the ability to define a `permalink` in the front matter e.g., `permalink: /tags.html`. This means that this is the page that will be access from `{{site.url}}/tags`. Jekyll will then look at the `layout` defined in the front matter and render the correct file from `_layouts`.

## Collaborating on Posts

Since one of the reasons i moved to Jekyll and markdown-based blog is to enable people to contribute to my posts. To do so, i host the posts into a [separate Github repository](https://github.com/ahmadassaf/blog) and include that as a separate git submodule by configuring the `.gitmodules` as follows:

```
[submodule "_posts"]
    path = _posts
    url = https://github.com/ahmadassaf/blog.git
```

## Featured Posts

In the homepage i want always to show a set of most recent N featured posts. To do that, i have added a `featured` property in the front matter that will indicate if this post that i want is featured or not.

## Pagination

For pagination i have used the [jekyll-paginate](https://github.com/jekyll/jekyll-paginate) gem which should be included in the `_config.yml` as:

```yml
paginate: 7
paginate_path: "posts/page/:num"
```

The `paginate_path` is the important property that we need to take care about. It specifies the page that we want to enable pagination on. The plugin does not support pagination on `tag` and `category` pages, so as a workaround i have a new `/posts` route that will contain all the posts and enable pagination on them. To do so, i have created a new dicrectory called `posts` in the root folder with an `index.html` page. This will be picked up by Jekyll and result in a `/posts` page. The page contains normal Liquid templates as follows:

```html
{% raw %}<div class="archive-container">
    <ul class="archive">
    {% for post in paginator.posts %}
        {% include partials/post.html %}
    {% endfor %}
    {% include partials/archive/pagination.html %}
    </ul>
</div>{% endraw %}
```

You notice that the pagination is enabled by including the partial `_includes/partials/archive/pagination`.

## Categories and Tag Pages

In a fashion similar to Wordpress i wanted to have pages for my categories and tags, to do so i have used [jekyll-archives](https://github.com/jekyll/jekyll-archives) gem. The plugin is enabled in the `config.yml` by:

```yml
jekyll-archives:
  enabled:
    - categories
    - tags
  layouts:
    category: archive
    tag: archive
  permalinks:
    tag: '/:name/'
    category: '/:name/'
```

This is straightforward as i just specify that i want to enable them on both category and tag pages and specify the layout that will render those pages. The permalink specifies the url of the page, i have set that up to be the name of the category or the tag.

> The layout specified has to be in the `/_includes` directory.

Another special page i created is a tags archive page. This is done by creating a page in `/_pages` and a `tags-archive` template. The main code to bring all the blog tags and their posts is:

```html
{% raw %}{% capture site_tags %}{% for tag in site.tags %}{{ tag | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign tags = site_tags | split:',' | sort %}

{% for item in (0..site.tags.size) %}{% unless forloop.last %}
{% capture tag %}{{ tags[item] | strip_newlines }}{% endcapture %}
   <h2 id="{{ tag }}" class="tag-heading">{{ tag }}</h2>
   <ul class="archive">
    {% for post in site.tags[tag] %}{% if post.title != null %}
        {% include partials/post.html %}
    {% endif %}{% endfor %}
  </ul>
{% endunless %}{% endfor %}{% endraw %}
```

## Data Files

As explained in the directory structure, the `_data` folder is where you can store additional data for Jekyll to use when generating your site. These files must be YAML, JSON, or CSV files (using either the `.yml`, `.yaml`, `.json` or `.csv` extension), and they will be accessible via `site.data`.

## Extra Features

There are various features powered by a set of JavaScript plugins and functions. These are mainly:

 - Responsive videos using [FitVids](http://fitvidsjs.com/)
 - Image Gallery using [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/)
 - Embedding Github Gists using `gist {{gist-id}} {{gist-name}}`
 - Embedding Tweets by simply pasting the url of a tweet e.g., `https://twitter.com/SpatialRed/status/778274886561193984` into the post. The url will be picked up by [jekyll-lazy-tweet-embedding](https://github.com/takuti/jekyll-lazy-tweet-embedding) plugin and rendered properly
 - Embedding YouTube videos with `youtube {youtube-video-id}` where you pass the **id** of the YouTube video using [this gist](https://gist.github.com/joelverhagen/1805814)
 - Embedding Vimeo videos with `vimeo {vimeo-video-id}` where you pass the **id** of the Vimeo video using [jekyll-vimeo-plugin](https://github.com/gummesson/jekyll-vimeo-plugin)
 - Open Graph, Twitter and Schema.or annotation enabled
 - Image compression using [grunt-contrib-imagemin](https://github.com/gruntjs/grunt-contrib-imagemin)

## Dynamic Navigation Menu

I wanted to have a navigation menu that is dynamic and shows automatically all the categories i have configured in the posts front matter. To do that, i use the following:

```html
{% raw %}{% capture site_categories %}{% for category in site.categories %}{{ category | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign categories = site_categories | split:',' | uniq %}

{% for item in (0..categories.size) %}{% unless forloop.last %}

{% capture category %}{{ categories[item] | strip_newlines }}{% endcapture %}
   <li {% if page.title == category or page.category == category %} class="current" {% endif %}><a href="{{ site.url }}/{{ category | downcase | replace:' ', '-'}}">{{ category }}</a></li>
{% endunless %}{% endfor %}{% endraw %}
```

> As you see that i transfer the name of the category to lower case and replace any space with `-` to match the permalink generated by Jekyll.

## Image Gallery

To utilize the image gallery we need to provide a simple markup

```html
{% raw %}{% capture images %}
    /images/posts/quora-better-notification.png
{% endcapture %}
{% include partials/post/gallery.html images=images caption="Quora Better Notifications (QBN) Chrome Extension" cols=1 %}{% endraw %}
```

note that the directory we referring to is `/images/posts`. This is the directory that we will copy all the posts images to using our grunt build script. Also you can pass multiple images in between the `capture`

There are also few CSS classes to display images side-by-side like:

```
<figure class="half">
    <a href="http://placehold.it/1200x600.JPG"><img src="http://placehold.it/600x300.jpg"></a>
    <a href="http://placehold.it/1200x600.jpeg"><img src="http://placehold.it/600x300.jpg"></a>
    <figcaption>Two images.</figcaption>
</figure>
<figure class="third">
.....
</figure>
```

In addition, there are various CSS classes for image alignment. They are:

```markdown
# The image blow happens to be **centered**.
![image-center](http://lorempixel.com/580/300){: .align-center}

# The image blow happens to be **left aligned**.
![image-left](http://lorempixel.com/150/150){: .align-left}

# The image blow happens to be **right aligned**.
![image-right](http://lorempixel.com/300/200){: .align-right}
```

## HTML Tags and Formatting

 - **Subscript Tag**: Getting our science styling on with `H<sub>2</sub>O`, which should push the "2" down.
 - **Superscript Tag**: Still sticking with science and Isaac Newton's `E = MC<sup>2</sup>`, which should lift the 2 up.
 - **Keyboard Tag**: This scarcely known tag emulates `<kbd>keyboard text</kbd>`, which is usually styled like the `<code>` tag.
 - **Abbreviation Tag**: Doing `*[CSS]: Cascading Style Sheets` will result in: The abbreviation CSS stands for "Cascading Style Sheets".
 - **Notices**: You can also add notices by appending `{: .notice}` to a paragraph.

 There are also a variety of button styles that can be used as follows:

```markdown
[Primary Button Text](#link){: .btn}
[Success Button Text](#link){: .btn .btn_success}
[Warning Button Text](#link){: .btn .btn_warning}
[Danger Button Text](#link){: .btn .btn_danger}
[Info Button Text](#link){: .btn .btn_info}
```

A notice displays information that explains nearby content. Often used to call attention to a particular detail.

When using Kramdown `{: .notice}` can be added after a sentence to assign the `.notice` to the `<p></p>` element. There are the following notices types:

```markdown
{: .notice}
{: .notice_info}
{: .notice_warning}
{: .notice_danger}
{: .notice_success}
```

## Enabling Search

One thing i wanted to add is the ability to perform full text search on the posts. To do so, i first wanted to be able to grab the posts data and have them saved. I managed to o that by creating the `/posts.json`:

```html
{% raw %}
[
  {% for post in site.posts %}
  {
        "{{ forloop.index }}" : {
          "id"       : "{{ forloop.index }}",
          "title"    : "{{ post.title | escape }}",
          "category" : "{{ post.categories | join: ' ' }}",
          "content"  : "{{post.content | strip_html | strip_newlines | remove:  "   " | escape | remove: "\"}}",
          "url"      : "{{ site.baseurl }}{{ post.url }}",
          "date"     : "{{ post.date }}"
        }
  }
  {% unless forloop.last %},{% endunless %}
  {% endfor %}
]
{% endraw %}
```

Now by requesting `{{site.url}}/posts.json` i am able to have a JSON file that contains the post id, title, category, url, published data and most importantly the content.
Enabling full text search is done with [elasticlunr](https://github.com/weixsong/elasticlunr.js/) by iterating the `posts.json` and building our index

```javascript
// This will include the posts.json built in the _site by jekyll
var posts   = require('../../../_site/posts.json');
// We would like now to fetch the posts JSON data into lunr.js and build the index
var index = el(function () {
    this.addField('title', { boost: 10 });
    this.addField('content', { boost: 5 });
    this.addField('category');
});

_.each(posts, function(post){
    index.addDoc(_.values(post)[0]);
});
```

## Putting it all together

To wrap up all these features together i have created a little build script using Grunt.js. The notable build actions are:

 - Cleaning up working directories (the images folder and the built JavaScript destination)
 - Create the images directory that we will copy the posts iamges into as well as the JavaScript build destination directory
 - Copy the images from the posts directory into the main images folder

 Now, i would like to easily be able deploy my application on my live server as well as being able to run and test it in my local machine. The main thing to note here is that we need to have the `url` pointing to two different URIs on each machine. To do this dynamically, i created a new `_config.dev.yml` file that will overwrite only the `url` setting to run on `localhost:4000` and kept the url in my main `_config.yml` to my live server address.

 Now, after doing that to serve the site locally i pass in the `--config` flag with the two config files, with the overriding config last as: `bundle exec jekyll serve --incremental --config _config.yml,_config.dev.yml`

 > note that the `--incremental` is a defualt optional flag to optimize the build and serve process by rebuilding changed files only and not the whole site

## Using Jekyll, Grunt and Browserify

I use [Browserify](http://browserify.org/) in my `main.js` to easily bundle up all of my front-end dependencies. Now, if i am serving my site and want to test my JavaScript changes, it is painful to build everytime the site for that. The jekyll watch feature will not run browserify for me, so instead i use the [grunt-concurrent](https://github.com/sindresorhus/grunt-concurrent) with a `watch` task defined to monitor and fire a browserify build whenever a change is detected and a background shell process using [grunt-bg-shell](https://github.com/rma4ok/grunt-bg-shell) to serve. The all come together like:

```javascript
browserify: {
     dist: {
         files: {
             'assets/js/build/main.js': ['assets/js/src/**/*.js']
         },
         options: {
             debug: true,
             standalone: pkg['export-symbol']
         }
     }
 },
 bgShell: {
     jekyllBuild: {
         cmd: 'jekyll build --incremental',
         done: function() {
             console.log("Finished Building Jekyll Site");
         }
     },
     jekyllServe: {
         cmd: 'bundle exec jekyll serve --incremental'
     },
     jekyllLocal: {
         cmd: 'bundle exec jekyll serve --incremental --config _config.yml,_config.dev.yml'
     }
 },
 watch: {
     files: ['assets/js/**/*.js'],
     tasks: ['browserify']
 },
 concurrent: {
     serve: [
         'watch',
         'bgShell:jekyllServe'
     ],
     local: [
         'watch',
         'bgShell:jekyllLocal'
     ],
     options: {
         logConcurrentOutput: true
     }
 }
```
In the end, i have three main grunt tasks:

```javascript
// Register the grunt build task on live server
grunt.registerTask('build', ['clean', 'mkdir:images', 'mkdir:js', 'copy:images', 'bgShell:jekyllBuild', 'browserify']);

// Register the grunt serve task on live server
grunt.registerTask('serve', ['build', 'minified', 'concurrent:serve']);

// Register the grunt serve task on local machine
grunt.registerTask('local', ['build', 'minified', 'concurrent:local']);
```

# Continuous Integration & Development (CI/CD)

I have my jekyll instance running on a Digital Ocean Droplet. to configure one, you can easily follow [their great tutorial](https://www.digitalocean.com/community/tutorials/how-to-get-started-with-jekyll-on-an-ubuntu-vps).

Jekyll website has a [great article on continuous integration](http://jekyllrb.com/docs/continuous-integration/) and [Deployment](https://jekyllrb.com/docs/deployment-methods/)In a nutshell,  serving Jekyll can be done in two ways:

 - It is a static website, so just have a webserver like Apache running and point that to the `_site`
 - Run the `jekyll serve` process on your server and proxy your webserver e.g., Apache to point to your `http://0.0.0.0:4000`

> Setting 0.0.0.0 as an address to serve from is a way of saying to match all network interfaces on the machine. So if your local IP was 192.168.0.1 it would serve on both 127.0.0.1 and 192.168.0.1, computers on your local network would have access to your jekyll site. By doing `jekyll serve -H 0.0.0.0` you make sure the website is accessible externally properly.

To enable those two scenarios, i am using a [Codeship](http://codeship.com) deployment pipeline that will make sure to pull the latest changes on the website and its submodules whenever a push is triggered on Github. I do that by having this line:

```shell
ssh -p $SSH-PORT-NUMBER root@SERVER-ADDRESS 'cd /www/blog; git pull origin master; git submodule foreach git pull origin master'
```

Where as you substitute the location of your github repo in the server to point correctly, e.g., `/www/blog`.

Now, after that you can have a git `post-receive` or `post-merge` hook that will run the appropriate grunt task e.g., `grunt serve` or if you running using [tmux](https://tmux.github.io/) for example and a jekyll serve process is already running, then it will pick up the change automatically and your changes will be reflected automatically.

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
# Relevant References:
 - [jekyll-now - Build a Jekyll blog in minutes, without touching the command line](https://github.com/barryclark/jekyll-now)
 - [Website Continuous Integration with Travis CI, Jekyll, gulp, and GitHub](https://cesiumjs.org/2016/02/03/Cesium-Website-Continuous-Integration/)
 - [Jekyll and Continuous Integration with Travis CI](http://distresssignal.org/jekyll-continuous-integration-travis-ci)
 - [Travis CI deployments to DigitalOcean](https://kjaer.io/travis/)
 - [Setting Up a Continuous Delivery Blog](http://blog.grubernaut.com/vps-migration/)
 - [How To Set Up Apache Virtual Hosts on Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-apache-virtual-hosts-on-ubuntu-14-04-lts)

