---
layout: post
title:  "Cleaning up Wordpress tags .. the right way !"
date:   2014-02-18
excerpt: "I have decided to write a small PHP script that will scan my WordPress database and posts to determine the unique tags that i should ONLY have"
tag:
- Wordpress
- PHP
category: web development
---

During the process of designing my blog (which i considered as a learning playground mostly), i had to import/export the database multiple times, delete and review posts and do lots of changes in my posts. In the end, i have noticed that although i have cleaned my posts, the number of tags is still unrealistic. After some digging, i discovered that at some point, WordPress was not cleaning my tags for unknown reasons to me up to now. I have decided to write a small PHP script that will scan my WordPress database and posts to determine the unique tags that i should ONLY have. The code below will do the following steps:

*   Retrieve all **published** posts (the status can be changed easily in the passed param array)
*   Get all the tags in WordPress database
*   Get all the tags assigned to these posts
*   Check if there exist any WordPress post with no tags assigned and notify the user
*   Print out the statistics, and delete all the extra tags found (you can enter a prompt here or allow for manual deletion)

```php
<?php

// Include Wordpress main file to be able to access WP functions
include('blog/wp-load.php');
// Define the scope of the search for posts, pages (published, drafts ... )
$args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1);
$posts_array = get_posts( $args );

echo " We have found ". count($posts_array) . " posts</br></br>";

// The array that will hold the total tags for all the posts
$tags_array = array();

// The tags array that is returned by Wordpress that contains extra bad tags
$tags = get_tags();
// This array will only hold the names of the tags in order to create a diff
$tagsNames = array();
$wordpress_total_tags = count($tags);

// Start the WP loop in order to check posts
foreach( $posts_array as $post ) {
    setup_postdata($post);
    ob_start();ob_end_clean();

    $post_tags = get_the_tags(); //get the post tags
    // Check if the post contain any tags, if not we will notify the user with the post's name and link
    if ($post_tags) {
        foreach($post_tags as $tag) {
            $tags_array[] =  $tag->term_id ; //get the tag name. This can be changed to term_id or whatever you want
        }
    } else echo "We have found no Tags in post: " . $post->ID . " name: ". $post->post_name ." <a href='http://ahmadassaf.com/blog/wp-admin/post.php?post=" . $post->ID."&action=edit'>Link</a></br></br>";

}

$total_posts_tags   = count($tags_array); //total number of tags in all posts
$unique_tags_array  = array_unique($tags_array); //unique tags only from the posts
$actual_unique_tags = count($unique_tags_array); //the number of unique tags found

echo "Total of: " . $wordpress_total_tags . " Tags in Wordpress Posts</br>";
echo "Total of: " . $total_posts_tags . " REAL Tags in Wordpress Posts</br>";
echo "Total of: " . $actual_unique_tags . " REAL & UNIQUE Tags in Wordpress Posts</br></br>";
echo "There are: " . ($wordpress_total_tags - $actual_unique_tags) . " Extra Tags Found</br>";

foreach ($tags as $tag) {
    $tagsNames[] = $tag->term_id ;
}

$extra_tags =  array_diff($tagsNames, $unique_tags_array);
foreach ($extra_tags as $term_id) {
    wp_delete_term( $term_id, 'post_tag');
}

?>
```

The end result will look like this:

```bash
We have found 285 posts

We have found no Tags in post: 60231 name: modern-powerful-php-debugging-helper-kint Link

Total of: 1009 Tags in Wordpress Posts
Total of: 1686 REAL Tags in Wordpress Posts
Total of: 788 REAL & UNIQUE Tags in Wordpress Posts

There are: 221 Extra Tags Found
Array ( [1] => .htaccess [3] => 960 Grid System [9] => Add-ons [11] => Adipoli [12] => Adobe Creative Suite [13] ........

Running the code again will output

We have found 285 posts

We have found no Tags in post: 60231 name: modern-powerful-php-debugging-helper-kint Link

Total of: 788 Tags in Wordpress Posts
Total of: 1686 REAL Tags in Wordpress Posts
Total of: 788 REAL & UNIQUE Tags in Wordpress Posts

There are: 0 Extra Tags Found
```
a
I hope you found this post useful, and please don't hesitate to write a comment if you have any question.