---
type: post
title: 'Introduction to Semantic Web'
tags: ['Semantic Web', 'Knowledge Representation', 'Linked Data']
summary: 'In the same way that Web 1.0 abstracted away the network and physical layers, the Semantic Web abstracts away the document and application layers involved in the exchange of information. The Semantic Web connects facts, so that rather than linking to a specific document or application'
featured: true
draft: false
date: '2014-04-21'
category: 'ai'
bibliography: references.bib
---

The model behind @Xie2016 the Web could be roughly summarized as a way to publish documents represented in a standard way (HTML), containing links to other documents and accessible through the Internet using standard protocols ([TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)/[IP](https://en.wikipedia.org/wiki/Internet_protocol_suite) and [HTTP](https://en.wikipedia.org/wiki/HTTP)). The result could be seen as a worldwide, distributed file system of interconnected documents that humans can read, exchange and discuss.

- Before the web, people used to write documents, cite references and then check the reference and go and look search for it, in the library or look in the library ... etc.
- The great invention of the web is the hyperlink; click on that link and you get to the next document in the chain .. you can easily go to the reference !! so the **web 1.0** was the web of documents
- **Web 2.0** was application silos .. social stuff .. its not nly about the data .. by the problem is that these systems do not interoperate (update facebook profile doesnt affect you linkedin ) .. data are not linked -> this was not only in web but also inside enterprise data
- **[Web 3.0](http://www.w3.org/standards/semanticweb/ 'Semantic Web')** is all about connecting the data .. not the documents but the data at lower levels

In summary, the great advantage of [Web 1.0](http://en.wikipedia.org/wiki/Web_1.0 'Web 1.0') was that it abstracted away the physical storage and networking layers involved in information exchange between two machines. This breakthrough enabled documents to appear to be directly connected to one another. Click a link and you're there—even if that link goes to a different document on a different machine on another network on another continent! In the same way that Web 1.0 abstracted away the network and physical layers, the Semantic Web abstracts away the document and application layers involved in the exchange of information.

The Semantic Web connects facts, so that rather than linking to a specific document or application, you can instead refer to a specific piece of information contained in that document or application. If that information is ever updated, you can automatically take advantage of the update. The word semantic itself implies meaning or understanding. As such, the fundamental difference between Semantic Web technologies and other technologies related to data (such as [relational databases](https://en.wikipedia.org/wiki/Relational_database) or the World Wide Web itself) is that the Semantic Web is concerned with the meaning and not the structure of data. This fundamental difference engenders a completely different outlook on how storing, querying, and displaying information might be approached. Some applications, such as those that refer to a large amount of data from many different sources, benefit enormously from this feature.  Others, such as the storage of high volumes of highly structured transactional data, do not.

What is meant by “semantic” in the Semantic Web is not that computers are going to understand the meaning of anything, but that the logical pieces of meaning can be mechanically manipulated by a machine to useful ends. So now imagine a new Web where the real content can be manipulated by computers. For now, picture it as a web of databases. One “semantic” website publishes a database about a product line, with products and descriptions, while another publishes a database of product reviews. A third site for a retailer publishes a database of products in stock. What standards would make it easier to write an application to mesh distributed databases together, so that a computer could use the three data sources together to help an end-user make better purchasing decisions? Semantic Web itself does not deal with unstructured content; instead, it is about representing not only structured data and links but also the meaning of the underlying concepts and relationships There's nothing stopping anyone from writing a program now to do those sorts of things, in just the same way that nothing stopped anyone from exchanging data before we had XML. But standards facilitate building applications, especially in a decentralized system. **From a technical point of view, the Semantic Web consists of:**

- **[Data Model](http://en.wikipedia.org/wiki/Data_model 'Data model')** : RDF ([Resource Description Framework](http://en.wikipedia.org/wiki/Resource_Description_Framework 'Resource Description Framework')): The data modeling language for the Semantic Web. All Semantic Web information is stored and represented in the RDF. It is a flexible and abstract model meaning that there is more than one representation of RDF.
- **Query Language**: SPARQL ([SPARQL Protocol and RDF Query Language](http://en.wikipedia.org/wiki/SPARQL 'SPARQL')): The query language of the Semantic Web. It is specifically designed to query data across various systems.
- **Schema and Ontology Languages**: OWL ([Web Ontology Language](http://en.wikipedia.org/wiki/Web_Ontology_Language 'Web Ontology Language')) - RDF Schema (RDFS) The schema language, or knowledge representation (KR) language, of the Semantic Web. They enable you to define concepts composably so that these concepts can be reused as much and as often as possible. Composability means that each concept is carefully defined so that it can be selected and assembled in various combinations with other concepts as needed for many different applications and purposes.

The term semantic technologies represents a fairly diverse family of technologies that have been in existence for a long time and seek to help derive meaning from information. Some examples of semantic technologies include natural language processing (NLP), data mining, [artificial intelligence (AI)](http://en.wikipedia.org/wiki/Artificial_intelligence 'Artificial intelligence'), category tagging, and semantic search. You might think of the goal of semantic technologies as separating signal from noise. **Some examples of existing semantic technologies being used today include:**

- **Natural-language processing (NLP)**:  NLP technologies attempt to process unstructured text content and extract the names, dates, organizations, events, etc. that are talked about within the text. There are many extensions of NLP and they include:

  - **Search**: Semantic Search often requires NLP parsing of source documents. The specific technique used is called Entity Extraction, which basically identifies proper nouns (e.g., people, places, companies) and other specific information for the purposes of searching. For example, consider the query, "Find me all documents that mention Barack Obama." Some documents might contain "Barack Obama," others "President Obama," and still others "Senator Obama." When used correctly, extractors will map all of these terms to a single concept.
  - **Auto-categorization**: Imagine that you have 100,000 news articles and you want to sort them based on certain specific criteria. That would take a human ages to do, but a computer can do it very quickly.
  - **[Sentiment Analysis](http://en.wikipedia.org/wiki/Sentiment_analysis 'Sentiment analysis')**: Sentiment Analysis measures the "sentiment" of an article, typically meaning whether the article's tone is positive, negative, or neutral. This application of NLP technology is often used in conjunction with search, but it can also be used in other contexts, such as alerting. For example, a business owner might ask an application to "alert me when someone says something negative regarding my company on Facebook."
  - **Summarization**: Often used in conjunction with research applications, summaries of topics are created automatically so that actual people do not have to wade through a large number of long-winded articles (perhaps such as this one!).
  - **Question Answering**: This is the new hot topic in NLP, as evidenced by Siri and Watson. However, long before these tools, we had Ask Jeeves (now Ask.com), and later Wolfram Alpha, which specialized in question answering. The idea here is that you can ask a computer a question and have it answer you (Star Trek-style! "Computer…").

- **Data mining**: Data mining technologies employ pattern-matching algorithms to tease out trends and correlations within large sets of data. Data mining can be used, for example, to identify suspicious and potentially fraudulent trading behavior in large databases of financial transactions.
- **Artificial intelligence or expert systems**: AI or expert systems technologies use elaborate reasoning models to answer complex questions automatically. These systems often include machine-learning algorithms that can improve the system's decision-making capabilities over time.
- **Classification**: Classification technologies use heuristics and rules to tag data with categories to help with searching and with analyzing information.
- **Semantic search**: Semantic search technologies allow people to locate information by concept instead of by keyword or key phrase. With semantic search, people can easily distinguish between searching for John F. Kennedy, the airport, and John F. Kennedy, the president.

The main goal behind knowing these technologies is that they help us in assembling the building blocks of the Semantic Web. For example, NLP can be used to extract structured data from unstructured documents (flat files like text documents). This data is then linked via Semantic Web technologies to other published data. This bridges the gap between documents (unstructured data) and structured data.

# Linked Data

One of the most important movements in the Semantic Web community is Linked Data, which strives to expose and connect all of the world's data in a readily queryable and consumable form. The goal of Linked Data is to publish structured data in such a way that it can be easily consumed and combined with other Linked Data.

## The Four Rules of Linked Data

So in a way, Linked Data is the Semantic Web realized via four best practice principles.

- Use URIs as names for things. An example of a URI is any URL. For example: http://assaf.website is the URI that refers to Ahmad Assaf.
- Use HTTP URIs so that people can look up those names.
- When someone looks up a URI, provide useful information, using the standards such as RDF and SPARQL.
- Include links to other URIs so that they can discover more things.

### The Four Rules Applied

1.  Instead of using application-specific identifiers—database keys, UUIDs, incremental numbers, etc.—you map them to a set of URIs. Each identifier must map to one single URI. For example, each row of those two tables is now uniquely identifiable using its URI.
2.  Make your URIs dereferenceable. This means, roughly, to make them accessible via HTTP as we do for every human-readable Web page. This is a key aspect of Linked Data: every single row of our tables is now fetch able and uniquely identifiable anywhere on the Web.
3.  Have our web server reply with some structured data when invoked. This is the Semantic Web "juicy" part. Model your data with RDF. Here is where you need to perform a paradigm shift from a relational data model to a graph one.
4.  Once all the rows of our tables have been uniquely identified, made dereferenceable through HTTP, and described with RDF, the last step is providing links between different rows across different tables. The main aim here is to make explicit those links that were implicit before shifting to the Linked data approach.
