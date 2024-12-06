:orphan:

Social Services
===============

.. This index is mostly for local testing, and is unlikely to appear in xbe_static_docs
.. frameworks/ is likely to appear in the list of xbe_static_docs component frameworks

.. toctree::
   :maxdepth: 2

   Concepts <concepts/index>
   Architecture <architecture>
   Performance <performance>

The Social Component is responsible for all social interaction within XBE. Composed of five sub-systems, the Social
Component is a fully functional and modern social network toolkit.

* Social `Profile`
* Activity Feed
* Mail
* Real-Time Communication (RTC)
* Relationships

Profile
=======

The social Profile contains all publicly available information about a given user; including their preferred display
name, an avatar image, as well as their rich presence information. Additionally, developers can extend the social
profile to include custom data; such as a biography, relationships to popular social media, and more.

Below you can see an example of how our launcher uses the custom bio and relationships data to render a complete profile page
that other users can see.

<insert screenshot>

Activity Feed
=============

Players can use post and share their activities using the Activity Feed. The Activity Feed works just like the news feed
of many popular social media networks. Users can create posts about their daily activities, include media attachments,
mention others and limit visibility of their posts only to those they desire. Others can then react and add comments
to each post.

Mail
====

Using the mail system, users are able to send each other messages. Each piece of `Mail` contains a subject, message body and
an optional set of attachments. Attachments are incredibly useful when sending game or friend invites like the one
show here.

Real-Time Communcation
======================

The Real-Time Communication system allows players to communicate in real time using text, voice or video. Using This
system users can create Channels and invite others to the conversation. A `Channel` can be created to allow
communication between two or more players, members of a session, organization, party, or any other construct. Channels
can be made public, allowing anyone to join, or limit access to a select group using private mode.

Every `Channel` supports the sending of text Messages by members. Users can add Reactions to messages as well as create
sub-threads for side conversations.

Relationships
=============

Finally, the social component features a powerful relationships system. Using relationships, players can follow people
that interest them, make friends and block others they find offensive. In addition, developers can leverage the
encounter relationship to encourage discovery and create engagement within the player community.

Players are able to view and manage these relationships directly from the launcher. They can view each of the four
types of relationships, as well as search and add. They can also hop over to the messages tab to approve or deny friend
requests from other players.
