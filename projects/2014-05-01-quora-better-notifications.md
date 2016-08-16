---
layout: post
title:  "Quora Better Notification (QBN)"
subtitle: "A Chrome Extension that will improve Quora Notifications"
excerpt: "I have been really frustrated with the default Quora notifications page. Hundreds of new notifications everyday, lots of them are redundant (i.e. the same question added to several topics i follow or x number of people added an answer to a question i follow). And its not only me, i have recently read A typical day on Quora for me, or why notifications need to be burned before they lay eggs and that actually what sparked the urge in me to develop something in the weekend to solve not only what i thought my problem, but apparently a wide-agreed-upon one"
tag:
- Chrome Extension
category: projects
---

<figure style="width: 300px" class="align-right">
  <img src="/images/posts/quora.svg" alt="">
</figure>

I have been really frustrated with the default [Quora](http://www.quora.com/ "Quora is your best source for knowledge.") notifications page. Hundreds of new notifications everyday, lots of them are redundant (i.e. the same question added to several topics i follow or x number of people added an answer to a question i follow). And its not only me, i have recently read [A typical day on Quora for me, or why notifications need to be burned before they lay eggs](http://neverbefore.quora.com/A-typical-day-on-Quora-for-me-or-why-notifications-need-to-be-burned-before-they-lay-eggs) and that actually what sparked the urge in me to develop something in the weekend to solve not only what i thought my problem, but apparently a wide agreed upon one.  I have only found [one attempt](http://quantitativelabs.blogspot.com/2012/07/quora-notifications.html) to fix this which is a bookmarklet that at the moment of writing this post was not functioning properly. However, some guy apparently ported that with some fixes into a Chrome extension called [Quora Extender](https://chrome.google.com/webstore/detail/quora-extender/ljefnhagdgpochbjiiknhflemdnnlebh?hl=en). Although it does a good job in combining the notifications, my comments are:

*   I don't like the approach for the interface and packing of elements together
*   They don't catch new notification fetched by the Quora infinite Scroll
*   They don't provide any clustering for notifications
*   I cannot easily navigate through topics by any kind of filters

<a class="btn btn_success" href="https://chrome.google.com/webstore/detail/doeadnmeadgfgcgplbnibocnkkngddeb">Download</a>

### Discussions about the issue

*   [Improving Quora Notifications](http://www.quora.com/Improving-Quora-Notifications)
*   [Can Quora let me filter out board notifications from all the other ones?](http://www.quora.com/Notifications-on-Quora/Can-Quora-let-me-filter-out-board-notifications-from-all-the-other-ones)
*   [Notifications on Quora](http://www.quora.com/Notifications-on-Quora)
*   [How could Quora improve notifications ?](http://www.quora.com/Notifications-on-Quora/How-could-Quora-improve-notifications?share=1)

I have decided that this has to end, i want to better view my notifications. This extension is a simple one. It can identify several actions in the notifications feed:

{% capture images %}
    /images/posts/quora-better-notification.png
{% endcapture %}
{% include partials/post/gallery.html images=images caption="Quora Better Notifications (QBN) Chrome Extension" cols=1 %}

*   New question added to a topic you follow
*   Replies to a some action you posted
*   Comments on one of your posts
*   Comments on one of your answers
*   Suggested edit to question
*   Asked you to answer a question
*   Mentioned you in a post
*   Wrote an answer for a question you follow
*   Promoted a question you asked
*   You have a new follower to one for your blogs
*   You have a new follower to one of your questions
*   You have a new user following you
*   Voted up an answer for you on some question
*   Thanked you for an answer or contribution
*   Tweeted about some of your content
*   Suggested to edit your bio



After Catching these notifications, i have hacked the sidebar and presented these as filters with a counter for the new ones. But doing only that is not enough for me at this point, i wanted to do some kind of clustering for some of the notification types.

## Notifications Clustering

At the current version of the extension i only cluster two types of notifications:

*   **New Answer Notification**: Instead of having multiple entries for answers added to a question i follow, they are now clustered like User(X) and (N) others posted an answer to question you follow.
*   **New Questions added to a Topic: **It happens very often that a single question is added to multiple categories, they are now clustered like Question(X) has been added to (N) Topics : (Topic1, Topic2 ... TopicN)

### Future Work

I am planning to finish clustering for all the other actions. For example, the upVoting notification will be clustered in a similar fashion to Twitter's notification: User(X) and (N) others voted up your answer ...

## Topics Filtering

If you are following lots of topics, you might be interested at some point to browse only a certain topic. For that, there is a dropdown list in the top that contains a list of all the topics (fine-grained list i.e. if there is a context found in a certain topic, the context is presented) discovered in the feed.

## Notes

*   Quora implements an infinite scroll mechanism to fetch new notifications. I had problems trying to catch when an infinite call is done as it is not done via a normal AJAX request as i could not intercept that by assigning a hook on the `ajax.success()` or `ajax.complete()` on the `document`. So at the moment, there is function that runs on intervals of 5 seconds that will check for new notifications fetched by Quora and then applies the clustering and cleaning.
*   This is a very early prototype that was during a weekend, so please try it out and i will appreciate any feedback
*   I will be keen on porting this plugin into a Bookmarklet if requested

<a class="btn btn_success" href="https://chrome.google.com/webstore/detail/doeadnmeadgfgcgplbnibocnkkngddeb">Download</a>