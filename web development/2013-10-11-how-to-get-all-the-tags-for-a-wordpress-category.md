---
layout: post
title:  "How to get all the tags for a WordPress Category"
excerpt: "For various reasons, one might want to get all the categories that are assigned for the posts in a certain category. In this post, you will get to know a code snippet that will do just that"
tag:
- Wordpress
- PHP
category: web development
---

<figure style="display:none">
  <img src="/images/posts/wordpress.jpg" alt="quora-logo">
</figure>

For various reasons, one might want to get all the categories that are assigned for the posts in a certain category. This snippet below will allow to do just that. What i did is simply putting that in the `functions` and then you get to call that function anywhere in the code. The parameter that you need to pass is the category ID. Please note that the table names that you have may have different prefix, the default is the `wp_` and that we pull in the tags from `published` posts only. You can change that by changing the post status parameter. This code retrieves the tags based on the number of their occurrences in the posts in **DESCENDING** order. You can change that as well by changing the order to `ASC`

```php
<?php
    function get_category_tags($args) {
        global $wpdb;
        $tags = $wpdb->get_results
        ("
            SELECT DISTINCT terms2.term_id as tag_id, terms2.name as tag_name, t2.count as posts_with_tag
            FROM
            wp_posts as p1
            LEFT JOIN wp_term_relationships as r1 ON p1.ID = r1.object_ID
            LEFT JOIN wp_term_taxonomy as t1 ON r1.term_taxonomy_id = t1.term_taxonomy_id
            LEFT JOIN wp_terms as terms1 ON t1.term_id = terms1.term_id,

            wp_posts as p2
            LEFT JOIN wp_term_relationships as r2 ON p2.ID = r2.object_ID
            LEFT JOIN wp_term_taxonomy as t2 ON r2.term_taxonomy_id = t2.term_taxonomy_id
            LEFT JOIN wp_terms as terms2 ON t2.term_id = terms2.term_id
            WHERE
            t1.taxonomy = 'category' AND p1.post_status = 'publish' AND terms1.term_id IN (".$args.") AND
            t2.taxonomy = 'post_tag' AND p2.post_status = 'publish'
            AND p1.ID = p2.ID
            ORDER by posts_with_tag DESC
            ");

        return $tags;
    }
?>
```