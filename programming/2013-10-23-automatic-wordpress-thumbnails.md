---
layout: post
title:  "Automatic Wordpress Thumbnails"
subtitle: "How to Extract a Post First Image, Add it to the Media Library and Assign it as a Post Thumbnail in WordPress ?"
excerpt: "It happens very often that you design your WordPress theme without a need to utilise thumbnails. But, what happens if you eventually need them?! The effort of manually assigning posts thumbnails is huge. In this post, we will examine how we can extract the first image of a post, add that image to the WordPress media library and finally assign that image to be the default thumbnail"
tag:
- Wordpress
- PHP
category: programming
image: /images/posts/wordpress.jpg
---

It happens very often that you design your WordPress theme without a need to utilize thumbnails. But, what happens if you eventually need them?! The effort of manually assigning posts thumbnails is huge. In this post, we will examine how we can extract the first image of a post, add that image to the WordPress media library and finally assign that image to be the default thumbnail. I did run this code in a separate PHP file in the root of my domain. [You need to provide access to your WordPress installation though](http://wordpress.stackexchange.com/questions/47049/what-is-the-correct-way-to-use-wordpress-functions-outside-wordpress-files). In the first step, we first need to fetch all the posts that wee need to inspect. In my snippet i specified that i need to search for **posts** that have been **p****ublished. **You can change these parameters to include drafts, pending posts, pages and so on.

```php
<?php
    $args = array( 'post_type' => 'post', 'post_status' => 'publish', 'posts_per_page' => -1);
    $posts_array = get_posts( $args );
    echo " We have found ". count($posts_array) . " posts</br>";
?>
```

Now, we need to loop through all the posts and start searching. To look for all images in a post we perform a `preg_match_all` on the post's content.

```php
<?php
    foreach( $posts_array as $post ) {
        setup_postdata($post);
        // Print out the title of the post being examined
        echo $post->post_title."\n";

        $first_img = '';
        ob_start();ob_end_clean();
        $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);

        $first_img = $matches [1] [0];
        // Check if image is on the same domain
        $isSameDomain = !strpos($first_img,'ahmadassaf.com') && $first_img);
        // Check if an image was found, you can add the boolean of the first domain && $isSameDomain
        if ($first_img) {
            $attachment_id = get_attachment_id_from_src($first_img);
            set_post_thumbnail( $post->ID ,$attachment_id );
            echo set_featured_image($post->ID, 'medium')."";    }
    }
?>
```

## Set the Featured Image

```php
<?php
    function set_featured_image($post_id,$filename) {
        $wp_filetype = wp_check_filetype(basename($filename), null );
        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
            'post_content' => '',
            'post_status' => 'inherit'
            );
        $attach_id = wp_insert_attachment( $attachment, $filename, $post_id );

        // you must first include the image.php file
        // for the function wp_generate_attachment_metadata() to work
        require_once(ABSPATH . "wp-admin" . '/includes/image.php');

        $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
        if (wp_update_attachment_metadata( $attach_id,  $attach_data )) {
            // set as featured image
            return update_post_meta($post_id, '_thumbnail_id', $attach_id);
        }
        echo "Featured Image Set (Y)";}
?>
```

## Get the Attachment ID

```php
<?php
    function get_attachment_id_from_src ($image_src) {
        global $wpdb;
        $query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
        $id = $wpdb->get_var($query);
        return $id;

    }
?>
```

## The Code

```php
<?php
    // Include Wordpress main file to be able to access WP functions
    include('blog/wp-load.php');
    // Define the scope of the search for posts, pages (published, drafts ... )
    $args = array( 'post_type' => 'post', 'post_status' => 'pending', 'posts_per_page' => -1);
    $posts_array = get_posts( $args );

    echo " We have found ". count($posts_array) . " posts";
    foreach( $posts_array as $post ) {

        setup_postdata($post);
        // Print out the title of the post being examined
        echo $post->post_title."\n";

        $first_img = '';
        ob_start();ob_end_clean();
        $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);

        $first_img = $matches [1] [0];
        // Check if image is on the same domain
        $isSameDomain = !strpos($first_img,'ahmadassaf.com') && $first_img);
        // Check if an image was found, you can add the boolean of the first domain && $isSameDomain
        if ($first_img) {
            $attachment_id = get_attachment_id_from_src($first_img);
            set_post_thumbnail( $post->ID ,$attachment_id );
            echo set_featured_image($post->ID, 'medium')."";    }
    }

    function set_featured_image($post_id,$filename) {
        $wp_filetype = wp_check_filetype(basename($filename), null );
        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', basename($filename)),
            'post_content' => '',
            'post_status' => 'inherit'
            );
        $attach_id = wp_insert_attachment( $attachment, $filename, $post_id );

        // you must first include the image.php file
        // for the function wp_generate_attachment_metadata() to work
        require_once(ABSPATH . "wp-admin" . '/includes/image.php');

        $attach_data = wp_generate_attachment_metadata( $attach_id, $filename );
        if (wp_update_attachment_metadata( $attach_id,  $attach_data )) {
            // set as featured image
            return update_post_meta($post_id, '_thumbnail_id', $attach_id);
        }
        echo "Featured Image Set (Y)";}

    function get_attachment_id_from_src ($image_src) {
        global $wpdb;
        $query = "SELECT ID FROM {$wpdb->posts} WHERE guid='$image_src'";
        $id = $wpdb->get_var($query);
        return $id;

    }
?>
```