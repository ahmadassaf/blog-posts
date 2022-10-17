---
title: 'Search Wordpress Posts'
subtitle: 'search all your WordPress posts for certain characters, Strings or Codes ?'
summary: 'During my many trials to start a useful blog, i have tried a handful of plugins and extensions that do all sort of stuff. However, after a while, especially when i became more and more familiar with PHP and WordPress, i decided to dump lots of these plugins and go with self developed tailored functions'
tags: ['Wordpress', 'PHP']
category: web development
image: /static/images/wordpress.jpg
---

During my many trials to start a useful blog, i have tried a handful of plugins and extensions that do all sort of stuff. However, after a while, especially when i became more and more familiar with PHP and WordPress, i decided to dump lots of these plugins and go with self developed tailored functions. Unfortunately, uninstalling these plugins did not solve all my problems. Some of them did actually insert some special markup to my posts ( mostly logos and links, for example the [Zemanta Plugin](http://wordpress.org/plugins/zemanta/) ). I decided that i had to clean up my posts from such 'malicious' markup. So i had to first of all to find the infected posts. To do so, i did write a small snippet that will run and search for several posts that contain specific strings, or characters or codes. I did run this code in a separate PHP file in the root of my domain. [You need to provide access to your WordPress installation though](http://wordpress.stackexchange.com/questions/47049/what-is-the-correct-way-to-use-wordpress-functions-outside-wordpress-files). In the first step, we first need to fetch all the posts that wee need to inspect. In my snippet i specified that i need to search for **posts** that have been **published**. You can change these parameters to include drafts, pending posts, pages and so on.

```php
<?php
    $args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1);
    $posts_array = get_posts( $args );
    echo " We have found ". count($posts_array) . " posts</br>";
?>
```

Now, we need to loop through all the posts and start searching

````php
<?php
foreach( $posts_array as $post ) {
    setup_postdata($post);
    ob_start();ob_end_clean();
    $output = strstr($post->post_content, 'zemanta-pixie');
    $post_categories = wp_get_post_categories( $post->ID );
    $output =  in_category( 'miscellaneous' ) && count($post_categories) == 1;
    if ($output) {
        echo "We have found code in post: " . $post->ID . " name: ".
       $post->post_name ." <a href=YOUR-WORDPRESS-ADDRESS/wp-admin/post.php?post=" .
       $post->ID."&action=edit'>Link</a></br>";
    }
}
?>

The search part happens in the string matching, you can change the string to whatever you want to look for:

```php
<?php
    $output = strstr($post->post_content, 'zemanta-pixie');
?>
````

You can perform a set of secondary sanity checks if you wish, i have included some just in case. For example, i am checking if the post found is not a specific category "miscellaneous" and that that the post belongs to only ONE category.

```php
<?php
    $post_categories = wp_get_post_categories( $post->ID );
    $output =  in_category( 'miscellaneous' ) && count($post_categories) == 1;
?>
```

Finally, when we output the link you have to fill in the corresponding WordPress Installation URL so that you will be able to directly edit the post.

```html
<a href=YOUR-WORDPRESS-ADDRESS/wp-admin/post.php?post=" . $post->ID."&action=edit'>Link</a>
```

Now, if you are searching for specific HTML tags in your post then you only need to change the search line to become:

```php
<?php
$output = preg_match_all('/<blockquote.*>/', $post->post_content, $matches);
?>
```

where we look for the existence of `blockquote` tags.

## The code

```php
<?php
    // Include Wordpress main file to be able to access WP functions
    include('blog/wp-load.php');
    // Define the scope of the search for posts, pages (published, drafts ... )
    $args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1);
    $posts_array = get_posts( $args );

    echo " We have found ". count($posts_array) . " posts";// Simple counter to check the number of "infected" posts
    $count = 0;

    // Start the WP loop in order to check posts
    foreach( $posts_array as $post ) {
        setup_postdata($post);
        ob_start();ob_end_clean();

        // Here we define the search parameters .. you can specify HTML tags here
        $output = preg_match_all('/<blockquote.*>/', $post->post_content, $matches);
        // You can specify a set of characters or Strings here
        $output = strstr($post->post_content, 'zemanta-pixie');

        $post_categories = wp_get_post_categories( $post->ID );

        // Another type of filtering .. checking post categories and number of posts
        $output =  in_category( 'miscellaneous' ) && count($post_categories) == 1;

        if ($output) {
            print_r($matches);
            echo "We have found code in post: " . $post->ID . " name: ". $post->post_name ." <a href='http://ahmadassaf.com/blog/wp-admin/post.php?post=" . $post->ID."&action=edit'>Link</a></br>";
            $count++;
        }
    }
    echo "Total of: " . $count . "</br>";
?>
```
