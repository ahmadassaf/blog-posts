---
layout: post
title:  "Get rid of unused attachments"
subtitle: "How to Delete WordPress Post Attachments when Deleting the Post ?"
excerpt: "A very annoying thing in WordPress is that you deleting a post doesn't cascade to the content (attachments) of that post. After a while, you can end up with lots of unused attachments and media files in your library that will only take up hard drive space"
tag:
- Wordpress
- PHP
category: programming
image: /images/posts/wordpress.jpg
---

A very annoying thing in WordPress is that you deleting a post doesn't cascade to the content (attachments) of that post. After a while, you can end up with lots of unused attachments and media files in your library that will only take up hard drive space ! The function below will allow deletion of post attachments when the post is deleted.

```php
<?php
    function delete_posts_before_delete_post($id){
        $subposts = get_children(array(
            'post_parent' => $id,
            'post_type'   => 'any',
            'numberposts' => -1,
            'post_status' => 'any'
            ));

        if (is_array($subposts) && count($subposts) > 0){
            $uploadpath = wp_upload_dir();

            foreach($subposts as $subpost){

                $_wp_attached_file = get_post_meta($subpost->ID, '_wp_attached_file', true);

                $original = basename($_wp_attached_file);
                $pos = strpos(strrev($original), '.');
                if (strpos($original, '.') !== false){
                    $ext = explode('.', strrev($original));
                    $ext = strrev($ext[0]);
                } else {
                    $ext = explode('-', strrev($original));
                    $ext = strrev($ext[0]);
                }

                $pattern = $uploadpath['basedir'].'/'.dirname($_wp_attached_file).'/'.basename($original, '.'.$ext).'-[0-9]*x[0-9]*.'.$ext;
                $original= $uploadpath['basedir'].'/'.dirname($_wp_attached_file).'/'.basename($original, '.'.$ext).'.'.$ext;

                if (getimagesize($original)){
                    $thumbs = glob($pattern);
                    if (is_array($thumbs) && count($thumbs) > 0){
                        foreach($thumbs as $thumb)
                            unlink($thumb);
                    }
                }

                wp_delete_attachment( $subpost->ID, true );
            }
        }
    }
?>
```

Now, we just need to add some hooks in order to run this function automatically when a delete action is triggered.

```php
### Up-To WordPress 3.1

add_action('delete_post', 'delete_posts_before_delete_post');

### From WordPress 3.2

add_action('before_delete_post', 'delete_posts_before_delete_post');
```