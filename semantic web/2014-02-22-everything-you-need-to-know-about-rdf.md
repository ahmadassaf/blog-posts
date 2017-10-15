---
layout: post
title:  "Everything you need to know about RDF"
excerpt: "Humans share, consume and produce knowledge using natural language; however presenting this knowledge in a machine readable and understandable format can be difficult. This post discusses the Resource Description Framework (RDF) which is the main data modeling block of the Semantic Web"
tag:
- Semantic Web
- Knowledge Representation
- RDF
- Linked Data
category: Semantic Web
featured: true
image: /images/posts/rdf.png
---

Humans share, consume and produce knowledge using natural language; however presenting this knowledge in a machine readable and understandable format can be difficult. Lets take for example the fact that **I (Ahmad) have (owner of ) a blog (http://ahmadassaf.com/blog)**. In natural language i can easily express that. If i want to convert this into [XML](http://en.wikipedia.org/wiki/XML "XML") which is one of the most popular data representation (markup) language, i can have the following representations:

However, this doesn't come intuitively to humans as they are used to present statements generally in a systematic fashion of `Subject - Verb/Predicate/Action - Object `From this thought, the idea of presenting knowledge in a three parts form was the basis of the [Resource Description Framework (RDF)](http://en.wikipedia.org/wiki/Resource_Description_Framework), where i can represent the following example saying that:

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-1.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

```xml
<!-- Presentation Method (1) -->
<blog>
     <owner>Ahmad</owner>
     <address>http://ahmadassaf.com/blog</address>
</blog>
<!-- Presentation Method  (2)-->
<person name="Ahmad">
     <blog>http://ahmadassaf.com/blog</blog>
</person>
<!-- Presentation Method  (3)-->
<person name="Ahmad" blog="http://ahmadassaf.com/blog" />
```

This is an intuitive knowledge representation using directed graphs, where the subjects and objects are the nodes and the predicates are the edges of that graph. This statement that comprises of these three parts is called RDF-Triple where the resource is a URI or a blank (empty) node, the property is a URI and the object can be a URI, literal or a [Blank Node](http://en.wikipedia.org/wiki/Blank_node "Blank node"). If we wish to transform this knowledge into the traditional relational model (tables) it will look like:

| **Subject** |  **Predicate** |           **Object**           |
|:-----------:|:--------------:|:------------------------------:|
|     Ahmad   |     has a blog |     http://ahmadassaf.com/blog |

# Constituents of an RDF Triple

## URIs

A Unique referenceable URI.  A [URI reference](http://en.wikipedia.org/wiki/Uniform_resource_identifier "Uniform resource identifier") is a Unicode string that does not contain any control characters and would produce a valid URI character sequence representing an absolute URI with optional [fragment identifier](http://en.wikipedia.org/wiki/Fragment_identifier "Fragment identifier") when subjected to the encoding that consists of:

*   encoding the Unicode string as [UTF-8](http://en.wikipedia.org/wiki/UTF-8 "UTF-8") giving a sequence of octet values.
*   %-escaping octets that do not correspond to permitted [US-ASCII](http://en.wikipedia.org/wiki/ASCII "ASCII") characters.

## Literals

Simple Strings that describe data values that do not have a separate existence. They can be plain (simple string combined with an optional language tag) or typed (string combined with a datatype URI and an optional language tag). Typed Literals are expressed via the XML Schema data types. Whenever we are using URIs to describe things in RDF we try as much as we can to reuse existing namespaces and for literals we use the XML Schema defined in [http://www.w3.org/2001/XMLSchema#](http://www.w3.org/2001/XMLSchema#).  So for example if i want to define a literal as a [String](http://en.wikipedia.org/wiki/String_%28computer_science%29 "String (computer science)") i use the following syntax :

    "Semantics"^^<http://www.w3.org/2001/XMLSchema#String>

We should note that literals are wrapped with quotations marks. The hash after the `XMLSchema` URI denotes the fragment identifier that points to String. In addition to these i can specify a language tag the describes the "natural" language of the text. For example, `"Semantic"@en` which means that this literal is an English world.

Literals are written either using double-quotes when they do not contain linebreaks like `"simple literal"` or `"long literal"` when they may contain linebreaks. Datatypes are a bit tricky. Let's think of the datatype for [floating-point numbers](http://en.wikipedia.org/wiki/Floating_point "Floating point"). At an abstract level, the floating-point numbers themselves are different from the text we use to represent them on paper. For instance, the text “5.1” represents the number 5.1, but so does “5.1000” and “05.10”. Here there are multiple textual representations — what are called lexical representations — for the same value.

A datatype tells us how to map lexical representations to values, and vice versa. RDF reuses the `XML Schema (W3C)"` datatypes, including `xsd:string, xsd:float, xsd:double, xsd:integer, and xsd:date` RDF can also contain custom datatypes that (you guessed it!) are simply named with a URI. If you omit a datatype declaration it be considered as a plain literal by many RDF tools, **which is not the same thing as a string**. However, as of RDF 1.1 (still in development at the time of writing) this distinction is going away, so going forward you should be able to treat `"Rob Gonzalez"` and `"Rob Gonzalez^^xsd:string` as equivalent, and many tools already do.

The semantics of RDF takes language tags and datatypes into account. This means two things. First, a literal value without either a language tag or datatype is different from a literal with a language tag and is different from a literal with a datatype. These four statements say four different things and none can be inferred from the others:


    #ahmad foaf:name "ahmad assaf"                   ahmad's name is a lanaguage-less,datatype-less raw text value.
    #ahmad foaf:name "ahmad assaf"@en                ahmad's name, in English, is ahmad assaf.
    #ahmad foaf:name "ahmed assef"@fr                ahmad's name, in French, is ahmed assef.
    #ahmad foaf:name "ahmad assaf"^^xsd:string       ahmad's name is a string.

So, an untyped literal with or without a language tag is not the same as a typed literal. The second part of the semantics of literals is that two typed literals that appear different may be the same if their datatype maps their **lexical representations** to the same value. The following statements are equivalent (at least for an RDF application that has been given the semantics of the XSD datatypes):

    #ahmad ex:age "20"^^xsd:float
    #ahmad ex:age "20.000"^^xsd:float

These mean ahmad age is 20. That is, the textual representation of the number is besides the point and is not part of the meaning encoded by the triples. Note that if the float datatype were not specified, the triples would not be inherently equivalent, and the textual representation of the 20 would be maintained as part of the information content. Sometimes the value of a property needs to be a fragment of XML, or text that might contain XML markup. RDF/XML provides a special notation to make it easy to write literals of this kind. This is done using a third value of the `rdf:parseType` attribute. Giving an element the attribute `rdf:parseType="Literal"` indicates that the contents of the element are to be interpreted as an XML fragment

    <rdf:Description rdf:ID="ahmadassaf">
         <foaf:name rdf:parseType="Literal">
              <span xml:lang="en">The <em>Owner</em> of this Blog </span>
         </foaf:name>
    </rdf:Description>

in Turtle notation the type used to describe XML literals is `rdf:XMLLiteral`

## Blank Nodes

Subjects or Objects can be modeled as blank nodes. They denote the existence of an individual with specific attributes but without providing any information about identity or reference. A **Ground RDF Graph** is a graph where there is no **Blank Nodes** .

# RDF Representation

RDF Resources can be in principle anything that must be uniquely identified and referenced by a URI. The Description of sources is done via representing properties and relationships among sources; this representation can be done in several ways:

## Labeled Directed Graph

This is a visual way of modeling RD as a Node-Edge-Node Triple. Its directed as the direction of the edge is significant and always points towards the object

## XML RDF Notation

Using XML syntax to represent RDF triples. We should point out that we do use namespaces in order to minimize the writing that we have to do. So, if we are using many URIs repeatedly throughout our representation then its better to define some global namespace and start referring to these namespaces with a shorthand.

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#">
         <rdf:Description rdf:about="http://ahmadassaf.com">
              <aa:hasBlog>
                   <rdf:Description rdf:about="http://ahmadassaf.com/blog"></rdf:Description>
              </aa:hasBlog>
         </rdf:Description>
    </rdf:RDF>

we notice that every RDF triple is wrapped between the `rdf:RDF` tags. Defining namesapces is done using the `xmlns` (XML namespace) followed by `:` and the name of the namespace and then the URI. URIs are represented with the `<rdf:description>` tag and the URI for that RDF resource should be identified in the `rdf:about` attribute. In addition to that, custom properties are wrapped in tags named after the namesapce defined on top followed buy the path to the sepccific property `<aa:hasBlog>` We can also define more than one property for each resource:

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#">
         <rdf:Description rdf:about="http://ahmadassaf.com" aa:hasEmail="me@ahmadassaf.com" >
              <aa:hasBlog rdf:resource="http://ahmadassaf.com/blog" />
              <aa:Name rdf:datatype="http://www.w3c.org/2001/XMLSchema#String">
                   Ahmad Assaf
              </aa:Name>
         </rdf:Description>
    </rdf:RDF>

In an **RDF/XML** document there are two types of XML nodes: 1) **resource XML nodes** and 2)** property XML nodes**. Resource XML nodes are the subjects and objects of statements, and they usually are `rdf:Description` tags that have an `rdf:about` attribute on them giving the URI of the resource they represent. In this example, the rdf:Description nodes are the resource nodes. Resource XML nodes contain within them property XML nodes (and nothing else). Each property XML node represents a single statement. The subject of the statement is the outer resource XML node that contains the property. We should also notice that we have used the rdf:datatype in order to specify the usage of certain types like Strings or Integers ... etc. The URL can be shortcut by using namespaces as well. We have the `xml:base` attribute that defines a base URI that will be used globally in the XML representation. So for example, if i have identified a `xml:base` tag as follows:

    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:aa="http://ahmadassaf.com/Personal#"
    xml:base="http://ahmadassaf.com/Administrators">

and i have changed my URI from `http://ahmadassaf.com` to `http://ahmadassaf.com/Administrators#AhmadAssaf` then in the XML RDF i point out to that as:

```xml
<rdf:Description rdf:about="#AhmadAssaf" aa:hasEmail="......"></rdf:Description>
```

instead of using `rdf:about` and then put the hash # in front of the fragment URI, i can use the `rdf:ID` which has the hash tag complemented in it so that i can write:

```xml
<rdf:Description rdf:ID="AhmadAssaf" aa:hasEmail="......"></rdf:Description>
```

However, despite the fact that **XML RDF** is difficult to read and a bit expensive and not flexible, it is the standard for web documents as we can embed it simply as XML is supported by most browsers and parsers.

## N3 Notation

Simple listing of triples. It is a shorthand non-XML serialization of RDF models designed with Human readability in mind. It is more compact than RDF XML but for complex and large models it can become very expensive.

```xml
<http://ahmadassaf.com> <http://ahmadassaf.com/Personal#hasBlog> <http://ahmadassaf.com/blog>.
```

**N3** has some syntactic sugar that allows further abbreviations. If many statements repeat the same subject and predicate, just separate the objects with commas:

```xml
<http://ahmadassaf.com> <http://ahmadassaf.com/Personal#hasBlog> <http://ahmadassaf.com/blog>, <http://MySecondBlog.com/>, <http://MyThirdBlog.com/> . 
```

And if the same subject is repeated, but with different predicates, one may use semicolons as in the example:

```xml
<http://ahmadassaf.com> <http://ahmadassaf.com/Personal#hasBlog> <http://ahmadassaf.com/blog>; foaf:name "Ahmad Assaf" .
```

## Turtle (Terse RDF Triple Language)

A simplified of the N3 notation. URIs are wrapped in angle brackets and Literals in quotations marks. Every triple ends up with a period and whitespaces or indentation will be ignored.

```xml
    <http://ahmadassaf.com>
    <http://ahmadassaf.com/Personal#hasBlog>
    <http://ahmadassaf.com/blog> . 
```

We have talked about namespaces and base URIs in XML. The same concepts are transfered into the turtle notation:

    @prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
    @prefix aa: <http://ahmadassaf.com/Personal#>.
    @prefix ex: <http://example.org/stuff/1.0/>.
    @base <http://ahmadassaf.com/Administrators>

so in my example i will have:

    :AhmadAssaf
    aa:hasBlog <http://ahmadassaf.com/blog> ;
    ex:fullname "Ahmad Assaf"^^xsd.string .

Note that we have used a semi colon to express that we want to keep stating facts about the same subject which is `<http://ahmadassaf.com>` We will go to more details about this notation a bit forward. In Turtle the referring to URIs in the base ID is done in a similar way of using the `rdf:ID` tag as the hash is complemented with the usage of colons `:` and the fragment URI ex: `:AhmadAssaf` The current base URI may be altered in a Turtle document using the `@base` directive. It allows further abbreviation of URIs but is usually for simplifying the URIs in the data, where the prefix directives are for vocabularies that describe the data. For example:

    # Here the scope base URI is the document URI
    <a1> <b1> <c1> .
    @base <http://example.org/ns/> .
    # In-scope base URI is http://example.org/ns/
    <a2> <http://example.org/ns/b2> <c2> .
    @base <foo/> .
    # In-scope base URI is http://example.org/ns/foo/ at this point ...

#### Notes

*   Turtle strings and URIs can use -escape sequences to represent Unicode code points (t, n, .... etc. )
*   Comments in Turtle take the form of `#`, outside a relative URI or strings, and continue to the end of line
*   The `,` symbol may be used to repeat the subject and predicate of triples that only differ in the object RDF term.

```
# this is not a complete turtle document
:a :b :c ,
:d .
# the last triple is :a :b :d .
```

*   The `;` symbol may be used to repeat the subject of of triples that vary only in predicate and object RDF terms.

```
# this is not a complete turtle document
:a :b :c ;
:d :e .
# the last triple is :a :d :e .
```

The Framework is a combination of web based protocols (URI, HTTP, XML ... etc.) that are based on formal models and defines all the allowed relationships among resources.

## Blank Nodes (B Nodes )

We have talked earlier about Blank Nodes or B Nodes. They are basically nodes that might not have names and are potentially un-referenceable. RDF only allows binary relations, so it's necessary to express many-way relations using intermediate nodes, and these nodes are often anonymous.They are used usually to express collections, for example if i want to say that my blog is influenced by other resources, in natural language i can say that my blog at `http://ahmadassaf.com/blog` is influenced by Blog A at `http://www.BlogA.com` and Blog B at `http://www.BlogB.com` If i want to represent this as a directed graph i will do:

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-2.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

The problem now is that how can i distinguish between these two sources ?! which URL corresponds to which resources name ?! so now we have to think of a workaround to ensure unique representation and selection of resources. We can make this happen (representing multi valued relation) by introducing additional nodes in the graph:

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-3.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

The nodes in black are blank nodes that do not have a name and only act as a connection point ( A visual representation):

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-4.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

Now how can we represent Blank Nodes in **XML RDF** and** Turtle** notation ?!

    <?xml version-"1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#">
    <rdf:Description rdf:about="http://ahmadassaf.com/blog" aa:hasName="Ahmad Assaf's Blog" >
         <aa:isInfluencedBy rdf:parseType="Resource"/>
              <aa:name>Blog A</aa:name>
              <aa:link>http://www.blogA.com</aa:link>
         </aa:isInfluencedBy>
    </rdf:Description>
    </rdf:RDF>

In** XML RDF** the blank nodes are denoted by the `rdf:parseType="Resource"`, in **Turtle** its much more easier:

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .

    <http://ahmadassaf.com/blog> aa:isInfluencedBy [
         aa:name "Blog A" ;
         aa:link "http://www.blogA.com" ].

we simply introduce blank nodes in Turtle by using the brackets `[ ]`. So far we have known that Blank Nodes do not have name, this is not always the case as sometime i need to give a label or a name to that blank node in order to be able to reference it locally. In this example the `nodeID` will follow the default base URI.

    <rdf:Description rdf:about="http://ahmadassaf.com/blog" aa:hasName="Ahmad Assaf's Blog">
         <aa:isInfluencedBy rdf:nodeID="Resouce1 />
    </rdf:Description>

    <rdf:Description rdf:nodeID="Resource1">
         <aa:name>Blog A</aa:name>
         <aa:link>http://www.blogA.com</aa:link>
    </rdf:Description>

In Turtle we use the underscore `_` followed by a colon that denotes the default namespace and then the Blank Node name

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .

    <http://ahmadassaf.com/blog> aa:isInfluencedBy  _:Resource1 .

    _:Resource1 aa:name "Blog A" ;
                    aa:link "http://www.blogA.com" .

so Blank Nodes do **NOT** need be de-referencable and accessed from the outside world, however they can have IDs or names that will them to be referenced in an RDF document or model.

# Data Structures in RDF

In RDF there exists some kind of collections (in computer science terms) that will allow us aggregate nodes or facts together. They are general data structures to enumerate any resource or literal. They are basically a syntactic sugar that will ease the process of writing code with no semantic expressiveness whatsoever. We have in RDF two different aggregators:

## Containers

An open list of elements possibly including duplicate members where new entries (additions) are possible Note that the container resource (which may either be a blank node or a resource with a URIref) denotes the group as a whole. The members of the container can be described by defining a container membership property for each member with the container resource as its subject and the member as its object. These container membership properties have names of the form `rdf:_n` where n is a decimal integer greater than zero, with no leading zeros, e.g., `rdf:_1, rdf:_2, rdf:_3` and so on, and are used specifically for describing the members of containers. Container resources may also have other properties that describe the container, in addition to the container membership properties and the `rdf:type` property.

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-5.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

We notice that collection node has a type of rdf:type rdf:seq which means that this is a sequential collection or list and the order of the items is important. Each item in the list have a unique property `rdf:_1, rdf:_2 ...` etc. In **Turtle**, sequential collections are represented as:

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .
    @base <http://ahmadassaf.com/>

    :blog aa:hasAdmins [
         a rdf:Seq;
         rdf:_1 <A>;
         rdf:_2 <B>;
         rdf:_3 <C>.
    ].

**Or it can be written as:**

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .
    @base <http://ahmadassaf.com/>

    :blog aa:hasAdmins :administrators.
    :administrators rdf:type rdf:Seq.
    :administrators rdf:_1 <A>.
    :administrators rdf:_2 <B>.
    :administrators rdf:_3 <C>.

**Or written as:**

    :blog aa:hasAdmins :administrators.
    :administrators rdf:type rdf:Seq;
    rdf:_1 <A>;
    rdf:_2 <B>;
    rdf:_3 <C>.

In **XML/RDF**

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#">

    <rdf:Description rdf:about="http://ahmadassaf.com/blog">
    <aa:hasAdmins>
         <rdf:Bag>
              <rdf:li rdf:resource="http://ahmadassaf.com/A"/>
              <rdf:li rdf:resource="http://ahmadassaf.com/B"/>
              <rdf:li rdf:resource="http://ahmadassaf.com/C"/>
         </rdf:Bag>
    </aa:hasAdmins>
    </rdf:Description>
    </rdf:RDF>

**RDF/XML** provides `rdf:li` as a convenience element to avoid having to explicitly number each membership property. The numbered properties `rdf:_1, rdf:_2` and so on are generated from the `rdf:li` elements in forming the corresponding graph. The element name `rdf:li` was chosen to be mnemonic with the term "list item" from HTML we notice that we referenced our blog by using the default namespace using the colon `:` and we have referred to the collection by the brackets `[]` (like Blank Nodes) but we have added the `rdf:type` `rdf:Seq` to that blank node. In RDF a short hand for the `rdf:type` is the letter a (like natural language in English when you say that this is a cat --> it means that this is sth with A type of cat ). We have known so far the Sequential container which denotes ordered list of elements, but we do also have another types of containers:

*   `rdf:Bag`  This is an unordered list of elements possibly including duplicate members and there is no given order for elements.
*   `rdf:Alt` Defines alternatives of elements and only one element of the given alternatives is relevant to the application ( a group of resources or literals that are alternatives (typically for a single value of a property) . An Alt container is intended to have at least one member, identified by the property rdf:_1\. This member is intended to be considered as the default or preferred value. Other than the member identified as `rdf:_1` the order of the remaining elements is not significant.

## Collections

These are closed lists where there is no extension possible. Elements of the list are already predefined. It really resembles the traditional list data structure with the fact that it is closed to insert operations. It is split recursively with **Head** (first) and **Tail** (rest), we end the list by linking to `rdf:nil`

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-6.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

Each of the blank nodes forming this list structure is implicitly of type `rdf:List` that is, each of these nodes implicitly has an `rdf:type` property whose value is the predefined type `rdf:List` although this is not explicitly shown in the graph.

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .
    @base <http://ahmadassaf.com/>

    :swt blog aa:hasAdmins [
         rdf:first <A>; rdf:rest [
              rdf:first <B>; rdf:rest [
                   rdf:first <C>;
                   rdf:rest rdf:nil .
    ]]].

However, in Turtle there are shortcuts to ease the simplify the syntax. We do that by using a new type of brackets `( )`

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .
    @base <http://ahmadassaf.com/>

    :blog aa:hasAdmins (<A> <B> <C> ) .

The collection of RDF statements (RDF Triples) form together an RDF graph. The assertion of an **RDF graph** (_assertion means that a term evaluates to true_) amounts to the assertion of all triples in it, this means a conjunction (logical AND) between all the statement corresponding to all the triples in the graph.

> The datastore that stores these triples is often called a triple store

**RDF/XML** provides a special notation to make it easy to describe collections using graphs of this form. In **RDF/XML**, a collection can be described by a property element that has the attribute `rdf:parseType="Collection"`, and that contains a group of nested elements representing the members of the collection. **RDF/XML** provides the `rdf:parseType` attribute to indicate that the contents of an element are to be interpreted in a special way. In this case, the `rdf:parseType="Collection"` attribute indicates that the enclosed elements are to be used to create the corresponding list structure in the RDF graph

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#">

    <rdf:Description rdf:about="http://ahmadassaf.com/blog">
         <aa:hasAdmins rdf:parseType="collection">
              <rdf:Description rdf:about="http://ahmadassaf.com/A" />
              <rdf:Description rdf:about="http://ahmadassaf.com/B" />
              <rdf:Description rdf:about="http://ahmadassaf.com/C" />
         </aa:hasAdmins>
    </rdf:Description>
    </rdf:RDF>

Semantic Web practitioners found it very difficult to deal with large amounts of triples for application development. There are lots of reasons that you would want to segment different subsets of triples from each other (simplified access control, simplified updating, trust, etc.), and vanilla RDF made segmentation tedious.

## Named Graphs

At first the community tried using reification to solve this data segmentation problem, but today everyone has converged on using named graphs. A Named Graph is a collection of RDF statement that are given an identifier (URI). When referring to triple in a name graph we often use a 4-tuple notation (often referred to as quad) instead of the standard 3-tuple one:

    <Named Graph>, <Subject>, <Predicate>, <Object>

When using named graphs, `TriG` is the de facto serialization. It's the same as Turtle except that statements in a single graph are grouped with `{}`

    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix aa: <http://ahmadassaf.com/Personal#> .
    @base <http://ahmadassaf.com/>

    :blogGraph {
         :blog aa:hasAdmins (<A> <B> <C> ) .
    }

This trivial example puts all the statements in the document into a single named graph, egotistically called `:blogGraph` Again, like all things in RDF `:blogGraph` is a URI. Looking at the 4-tuples, it's pretty obvious that the same statement can exist in multiple named graphs. This is by design and is a very important feature. By organizing the statement into named graphs, a Semantic Web application can implement access control, trust, data lineage, and other functionality very cleanly.

# RDF Reification

RDF applications sometimes need to describe other RDF statements using RDF, for instance, to record information about when statements were made, who made them, or other similar information (this is sometimes referred to as "provenance" information). Moreover, sometimes we will come across use cases where we deduce facts in our model, and the deducted facts also need to be used and modeled (become the subject of a new RDF statements). For example, if a detective (Sherlock Holmes) deduced that the gardener is the one who has killed the butler, then i might want to use this new discovered fact in a new RDF statement. This is another use case of **reification. **

> **Reification **allows interleaving of RDF statements and making statements about other statements

RDF provides a built-in vocabulary intended for describing RDF statements. A description of a statement using this vocabulary is called a reification of the statement. The RDF reification vocabulary consists of the

*   type `rdf:Statement` describes an RDF statement, consisting of the following properties:
    *   `rdf:subject` the described resource
    *   `rdf:predicate` the original property
    *   `rdf:object` the value of the property

    ex:Gardener ex:hasKilled ex:Butler
    ex:Sherlock ex:deduces ex: ????

The use of reification makes it fairly simple to represent this information:

    ex:Sherlock ex:deduces ex:StatementOnGardener .
    ex:statementOnGardener a rdf:Statement ;
        rdf:subject ex:Gardener ;
        rdf:predicate ex:hasKilled ;
        rdf:object ex:butler .

However, while RDF provides this reification vocabulary, care is needed in using it, because it is easy to imagine that the vocabulary defines some things that are not actually defined.for example, lets take the statement:

    :blog aa:hasAdmins :ahmadassaf

Using the reification vocabulary, a reification of the statement about the blog's administrator would be given by assigning the statement a URIref such as `:triple12345` (so statements can be written describing it), and then describing the statement using the statements:

    :triple12345 rdf:type rdf:Statement.
    :triple12345 rdf:subject :blog.
    :triple12345 rdf:predicate aa:hasAdmin.
    :triple12345 rdf:object :ahmadassaf.

{% capture images %}
    /images/posts/everything-you-need-to-know-about-rdf-7.png
{% endcapture %}
{% include partials/post/gallery.html images=images cols=1 %}

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#"
                  xmlns:dc="http://purl.org/dc/elements/1.1/"
                  xml:base="http://ahmadassaf.com/triples">

    <rdf:Description rdf:about="http://ahmadassaf.com/blog">
         <aa:hasAdmins>
              <rdf:Description rdf:ID="ahmadassaf" />
         </aa:hasAdmins>
    </rdf:Description>

      <rdf:Statement rdf:about="#triple12345">
        <rdf:subject rdf:resource="http://ahmadassaf.com/blog"/>
        <rdf:predicate rdf:resource="http://ahmadassaf.com/Personal#hasAdmins"/>
        <rdf:object rdf:resource="http://ahmadassaf.com/ahmadassaf" />

        <dc:creator rdf:resource="http://ahmadassaf.com/85740"/>

      </rdf:Statement>

    </rdf:RDF>

The subject of these reification triples is a URI ref formed by concatenating the base URI of the document (given in the xml:base declaration), the character `#` (to indicate that what follows is a fragment identifier), and the value of the `rdf:ID` attribute. However you can generate the same graph (Reification) by using the `rdf:ID`

    <?xml version="1.0" encoding="utf-8"?>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                  xmlns:aa="http://ahmadassaf.com/Personal#"
                  xmlns:dc="http://purl.org/dc/elements/1.1/"
                  xml:base="http://ahmadassaf.com/triples">

    <rdf:Description rdf:about="http://ahmadassaf.com/blog">
         <aa:hasAdmins rdf:ID="triple12345" >
              <rdf:Description rdf:ID="ahmadassaf" />
         </aa:hasAdmins>
    </rdf:Description>

      <rdf:Description rdf:about="#triple12345">
        <dc:creator rdf:resource="http://ahmadassaf.com/85740"/>
      </rdf:Description >

    </rdf:RDF>

In this case, specifying the attribute `rdf:ID="triple12345"` in the aa:hasAdmins element results in the original triple describing the blog administrator:

    http://ahmadassaf/blog aa:hasAdmins http://ahmadassaf.com/triples#ahmadassaf

plus the reification triples:

    http://ahmadassaf.com/triples#triple12345 rdf:type rdf:Statement.
    http://ahmadassaf.com/triples#triple12345 rdf:subject :blog.
    http://ahmadassaf.com/triples#triple12345 rdf:predicate aa:hasAdmin.
    http://ahmadassaf.com/triples#triple12345 rdf:object :ahmadassaf.

## Reification Advantages

*   Modeling data provenance
*   Formalizing statements about Reliability and Trust
*   Definition of metadata about statements (Assertions and Statements)

# Wrap Up

*   An RDF Model is a set of RDF statements
*   An RDF statement consists of subject, property, object
*   Subjects and objects and resources while an object can be either a literal or a resource

So far we have talked about several RDF representations (A serialization format is a way to encode information so that when it's passed between machines it can be parsed, XML is a serialization format, RDF is a data model); however there are few more worth mentioning:

*   **TriG**: TriG is Turtle but with support for named graphs. It's the de facto standard for serializing RDF with named graphs.
*   **RDFa (RDF embedded in HTML)**: You can embed RDF data within normal web pages by using RDFa.
*   **N-Triples**: is a very basic RDF serialization. Its key feature is that only one triple exists per line so that it's very quick to parse and so that Unix command-line tools can easily manipulate it. It's also highly compressible, so large, public RDF sources like [DBpedia ](http://dbpedia.org)often publish data in N-Triples form.

What sets RDF apart from XML is that RDF is designed to represent knowledge in a distributed world. That RDF is designed for knowledge, and not data, means RDF is particularly concerned with meaning. Everything at all mentioned in RDF means something. It may be a reference to something in the world, like a person or movie, or it may be an abstract concept, like the state of being friends with someone else. And by putting three such entities together, the RDF standard says how to arrive at a fact. The second key aspect of RDF is that it works well for distributed information. That is, RDF applications can put together RDF files posted by different people around the Internet and easily learn from them new things that no single document asserted. It does this in two ways, first by linking documents together by the common vocabularies they use, and second by allowing any document to use any vocabulary. This allows enormous flexibility in expressing facts about a wide range of things, drawing on information from a wide range of sources.

> **To distinguish between URIs, namespaced names (abbreviated URIs), anonymous nodes, and literal values,** **I used the following common convention**

*   Full URIs are enclosed in angle brackets.
*   Namespaced names are written plainly, but their colons give them away.
*   Anonymous nodes are written like namespaced names, but in the reserved "_" namespace with an arbitrary local name after the colon.
*   Literal values are enclosed in quotation marks.
