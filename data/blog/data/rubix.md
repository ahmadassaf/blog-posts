---
type: 'Blog'
title: 'RUBIX'
tags: ['Semantic Web', 'Schema Matching', 'Data Integration']
summary: 'RUBIX is a framework that enables business users to semi-automatically combine potentially noisy data residing in heterogeneous silos. Semantically related data is identified and appropriate mappings are suggested to users'
subtitle: 'A Framework for Improving Data Integration with Linked Data'
featured: 'false'
date: '2015-04-13'
category: 'data'
---

# Introduction

Companies have traditionally performed business analysis based on transactional data stored in legacy relational databases. The enterprise data available for decision makers was typically relationship management or [enterprise resource planning](http://en.wikipedia.org/wiki/Enterprise_resource_planning 'Enterprise resource planning') data. However, social media feeds, weblogs, sensor data, or data published by governments or international organizations are becoming increasingly available.

> With today's public data sets containing billions of data items, more and more companies are looking to integrate external data with their traditional enterprise data to improve business intelligence analysis. These distributed data sources, however, exhibit heterogeneous data formats and terminologies and may contain noisy data. RUBIX is a novel framework that enables business users to semi-automatically perform [data integration](http://en.wikipedia.org/wiki/Data_integration' Data integration') on potentially noisy tabular data. This framework offers an extension to [Open Refine](http://openrefine.org/) (Formerly [Google Refine](http://code.google.com/p/google-refine/ 'Google Refine')) with novel [schema matching](http://en.wikipedia.org/wiki/Schema_matching 'Schema matching') algorithms leveraging Freebase rich types. First experiments show that using [Linked Data](http://en.wikipedia.org/wiki/Linked_data 'Linked data') to map cell values with instances and column headers with types significantly improves the quality of the matching results and, therefore, should lead to more informed decisions.

The quality and amount of structured knowledge available make it feasible for companies to mine this massive amount of public data and integrate it into their next-generation enterprise information management systems. Analyzing this new type of data within the context of existing enterprise data should bring them new or more accurate business insights and allow better recognition of sales and market opportunities. These new distributed sources, however, raise tremendous challenges. They have inherently different file formats, access protocols, or query languages. They possess a data model with different ways of representing and storing the data.

Data across these sources may be noisy (e.g., duplicate or inconsistent), uncertain, or semantically similar yet different. Therefore, integration and provision of a unified view for these heterogeneous and complex data structures require potent tools to map and organize the data. RUBIX is a framework that enables business users to semi-automatically combine potentially noisy data residing in heterogeneous silos. Semantically related data is identified, and appropriate mappings are suggested to users. On user acceptance, data is aggregated and can be visualized directly or exported to [Business Intelligence](http://en.wikipedia.org/wiki/Business_intelligence' Business intelligence') reporting tools.

The framework is composed of a set of extensions to Open Refine (now called [Open Refine](http://openrefine.org/)) server and a plug-in to its user interface. Open Refine was selected for its extensibility and good cleansing and transformation capabilities. We first map cell values with instances and column headers with types from popular data sets from the Linked [Open Data](http://en.wikipedia.org/wiki/Open_data 'Open data') Cloud. To perform the matching, we use the Auto Mapping Core (also called AMC ) that combines the results of various similarity algorithms. The novelty of our approach resides in our exploitation of Linked Data to improve the schema-matching process. We developed specific algorithms on rich types from vector algebra and statistics. The AMC generates a list of high-quality mappings from these algorithms allowing better data integration. First experiments show that Linked Data significantly increases the number of mappings suggested to the user. Schemas can also be discovered if column headers need to be defined and can be improved when they are not named or typed correctly. Finally, data reconciliation can be performed regardless of data source languages or ambiguity. All these enhancements allow business users to get more valuable and higher-quality data and, consequently, to make more informed decisions.

# Related Work

While schema matching has always been an active research area in data integration, new challenges are faced today by the increasing size, number, and complexity of data sources and their distribution over the network. Data sets are only sometimes correctly typed or labeled, hindering matching. Some work has tried to improve existing data schemas in the past, but literature mainly covers automatic or semi-automatic labeling of anonymous data sets through Web extraction. Examples include automatically labeling news articles with a tree structure analysis or defining heuristics based on distance and alignment of a data value and its label.

These approaches, however, restricting label candidates to Web content from which the data was extracted, go a step further by launching speculative queries to standard Web search engines to enlarge the set of potential candidate labels. More recently, applies machine learning techniques to respectively annotate table rows as entities, columns as their types, and pairs of columns as relationships, referring to the YAGO ontology. The work presented aims, however, at leveraging such annotations to assist semantic search query construction and not at improving schema matching. With the emergence of the Semantic Web, new work in the area has tried to exploit Linked Data repositories.

The authors of the present techniques automatically infer a semantic model on tabular data by getting top candidates from Wikitology and classifying them with the Google page ranking algorithm. Since the authors aim to export the resulting table data as Linked Data and not improve schema matching, some columns can be mislabeled, and acronyms and languages need to be better handled. A tagging mechanism adds semantic information to tabular data in the Helix project. A sample of instance values for each column is taken, and a set of tags with scores are gathered from online sources such as Freebase. Tags are then correlated to infer annotations for the column. The mechanism is similar to ours, but the resulting tags for the column are independent of the existing column name, and sampling may not always provide a representative population of the instance values.

# Proposition

[Open Refine](http://openrefine.org/) (formerly Google Refine and Freebase Gridworks) is a tool designed to quickly and efficiently process, clean, and eventually enrich large amounts of data with existing knowledge bases such as Freebase. The tool has, however, some limitations: it was initially designed for data cleansing on only one data set at a time, with no possibility to compose columns from different data sets. Moreover, Open Refine has some strict assumptions over the input of spreadsheets, making it challenging to identify primitive and complex data types. The AMC is a novel framework that supports the construction and execution of new matching components or algorithms. AMC contains several matching components that can be plugged and used, like string matches (Levenshtein, JaroWinkler … etc.), data types matches, and path matches. It also provides a combination and selection algorithms to produce optimized results (weighted average, average, sigmoid … etc.).

## Activity Flow

The data set to match can be contained in files (e.g., CSV, Excel spreadsheets, etc.) or defined in Open Refine projects. The inputs for the match module are the source and target files and/or projects that contain the data sets.

- These projects are imported into the AMC's internal data structure (called schema).
- The AMC then uses a set of built-in algorithms to calculate similarities between the source and target schemas on an element basis, i.e., column names in the case of spreadsheets or relational databases.
- The output is a set of similarities, each containing a triple consisting of source schema element, target element, and similarity between the two.
- These results are presented to the user in tabular form such that s/he can check, correct, and potentially complete the mappings.
- Once the user has completed matching columns, the merge information is sent back to Open Refine, which calls the merge module.
- This module creates a new project, which contains a union of the two projects where the matched columns of the target project are appended to the corresponding source columns.
- The user can then select the columns that s/he wants to merge and visualize by dragging and dropping the required columns onto the fields that represent the x and y axes.
- Once the selection has been performed, the aggregation module merges the filtered columns, and the result can be visualized.

As aggregation operations can quickly become complex, our default aggregation module can be replaced by more advanced analytics on tabular data.

## Schema Matching

Schema matching is typically used in business-to-business integration, metamodel matching, as well as [Extract, Transform, Load (ETL)](http://en.wikipedia.org/wiki/Extract,_transform,_load) processes. For non-IT specialists, the typical way of comparing financial data from two different years or quarters is to copy and paste the data from one Excel spreadsheet into another one, thus creating redundancies and potentially introducing copy-and-paste errors. Schema matching techniques can support this process semi-automatically, i.e., to determine which columns are similar and propose them to the user for integration. This integration can then be done with appropriate business intelligence tools to provide visualizations. One of the problems in performing the integration is the quality of data. The columns may contain data that needs to be fixed or corrected. There may also be no column headers to provide suitable information for matching. Several approaches exploit the similarities of headers or similarities of types of column data. We propose a new approach that exploits semantic-rich typing provided by popular datasets from the Linked Data Cloud.

## Data Reconciliation

Reconciliation enables entity resolution, i.e., matching cells with corresponding typed entities in case of tabular data. Open Refine already supports reconciliation with Freebase but requires confirmation from the user. For medium to large data sets, this can be very time-consuming. To reconcile data, we, therefore, first identify the columns that are candidates for reconciliation by skipping the columns containing numerical values or dates. We then use the Freebase search API to query for each cell of the source and target columns the list of typed entity candidates. Results are cached to be retrieved by our similarity algorithms.

## Matching Unnamed and Untyped Columns

The AMC can combine the results of different matching algorithms. Its default built-in matching algorithms work on column headers, producing an overall similarity score between the compared schema elements. It has been proven that combining different algorithms dramatically increases the quality of matching results. However, when headers are missing or ambiguous, the AMC can only exploit domain intersection and inclusion algorithms based on column data. Therefore, We have implemented three new similarity algorithms that leverage the rich types retrieved from Linked Data to enhance the matching results of unnamed or untyped columns.

## [Cosine Similarity](http://en.wikipedia.org/wiki/Cosine_similarity)

The first algorithm that we implemented is based on vector algebra. Let $\mathbf{v}$ be the vector of ranked candidate types returned by Freebase for each cell value of a column. 

## [Pearson Product-Moment Correlation Coefficient (PPMCC)](http://en.wikipedia.org/wiki/Pearson_product-moment_correlation_coefficient)

The second algorithm we implemented is PPMCC, a statistical measure of the linear independence between two variables \\(\left(x,y\right)\\). In our method, x is an array that represents the total scores for the source column-rich types, and y is an array that represents the mapped values between the source and the target columns. The values present in x but not in y are represented by zeros.

## [Spearman’s Rank Correlation Coefficient](http://en.wikipedia.org/wiki/Spearman's_rank_correlation_coefficient)

The last algorithm we implemented to match unnamed and untyped columns is Spearman's rank correlation coefficient. It applies a rank transformation on the input data and computes PPMCC afterward on the ranked data. Our experiments used Natural Ranking with default strategies for handling ties and NaN values. The ranking algorithm is, however, configurable and can be enhanced by using more sophisticated measures.

## Handling Non-String Values

So far, we have covered several methods to identify the similarity between "String" values, but how about other numeral values like dates, money, distance …etc. For this purpose, we have implemented some primary type identifiers that recognize dates, money, numeral values, and numerals used as identifiers. This will help us better match corresponding entries. Adjusting AMC's combination algorithms can be very important at this stage; for example, assigning weights to different matches and tweaking the configuration can result in more accurate results.

# Experiments

We present in this section the results from experiments we conducted using the methods described above. To appreciate the value of our approach, we have used a real-life scenario that exposes common problems faced by the management in SAP. Our data come from two different SAP systems; the Event Tracker and the Travel Expense Manager. The Event Tracker provides an overview of events (Conferences, Internal events … etc.) that SAP Research employees contribute to or host. The entries in this system contain as much information as necessary to give an overview of the activity like the Activity type and title, travel destination, travel costs divided into several subcategories (conference fees, accommodation, transportation, and others), and duration related information (departure, return dates) … etc. Entries in the Event Tracker are generally entered in batches as employees fill in the planned events they wish to attend or contribute to at the beginning of each year. Afterward, according to their allocated budget, managers can accept or reject these planned events.
On the other hand, the Travel Expense Manager contains the actual data for the successfully accepted events. This system is used by employees to enter their actual trip details to claim their expenses. It contains more detailed information and aggregated views of the events, such as the total cost, duration calculated in days, currency exchange rates, and many internal system tags and Identifiers. Matching reports from these two systems is of great benefit to managers to organize and monitor their allocated budget; they mainly want to:

1. Find the number of the actual (accepted plans) compared with the total number of entered events.
2. Calculate the deviation between each event's estimated and actual cost.

However, matching from these two sources can face several difficulties that can be classified into two domains; the first is in global labels (or column headers as we are dealing with Excel-like files). These problems can be summarized in the following:

- **Missing labels**: Importing files into Open Refine with empty headers will assign that column a dummy name by concatenating the word "column" with a number starting from 0.
- **Dummy labels or semantically unrelated names**: This is a common problem, especially from the data coming from the Travel Expense Manager. This can be applied to columns labeled according to the corresponding database table (i.e., lbl_dst to denote destination label). Moreover, column labels do not often convey the semantic type of the underlying data.

The second domain is at the cell (single entry) level; these problems can be summarized in the:

- Detecting different date formats: We discovered that the date fields from the two systems have different formats. Moreover, the built-in type detection in Open Refine converts the detected date (if found) into another third format.
- Entries from different people can be made in different languages.
- Entries in the two systems can be incomplete; the system can shorten an entry automatically; for example, selecting a country in the Travel Expense Manager will result in filling out that country code in the exported report (i.e., France = FR).
- Inaccurate entries: This is one of the most common problems faced; users in the same field can enter several values corresponding to the same entity. For example, in the destination column, users can enter the country, the airport at the destination, the city, or even the event's exact location (i.e., office location).
Completing a Ph.D. can be a hell of a task. It took me lots of time to develop a framework that optimizes how I do research and write and publish my research. This post discusses some of the tools and techniques I used in addition to LaTEX best practices.