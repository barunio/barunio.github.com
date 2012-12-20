---
layout: post
title: Social Anarchy in Software Development
custom_css: true
font1: Lato:300
font2: Gilda+Display
font3: Rambla:700
font4: Ubuntu+Mono
---

<img src="{{site.baseurl}}/images/2012-12-13/anarchy.png" alt='' id='anarchyA'/>

<div id='sidebar'>
  <div id='links'>
    <a href='#post'>Introduction</a>
    <a href="#a_concise_definition_of_anarchy">Anarchy defined</a>
    <a href='#anarchy_within_a_company_culture'>Company culture</a>
    <a href='#goals_of_a_software_development_process'>Process goals</a>
    <a href='#a_standard_approach_enforcing_testdriven_development'>A standard
    approach</a>
    <a href='#our_anarchist_approach'>Anarchist alternative</a>
    <a href='#the_rules_of_the_commons_atomic_commits'>Rules of the commons</a>
    <a href='#the_final_process'>Final process</a>
    <a href='#addendum'>Addendum</a>
  </div>

  <div id="about">
    Hi, I'm Barun<br>Founder &amp; CTO of <a href="wegowise.com">WegoWise</a>
  </div>

  <div id='original'>
    <div class='title'>Original talk</div>
    <div class='date'>12/11/2012</div>
    <a href='https://speakerdeck.com/barunio/atomic-commits'>View slides</a>
    <a href='http://bostonrb.org/presentations/atomic-commits'>Watch video</a>
  </div>
</div>

## Preface: philosophical constructs

One of my favorite things to do is contemplate questions that begin with *why*
and *how* -- questions that often don't have clear answers, and have the power
to transform otherwise banal topics into subjects worthy of meaningful inquiry.
This aligns with Zen teachings that any activity may be a path to
enlightenment. Everything matters, because everything is interconnected.

In other words, everything has a philosophy.

So recently, when I was to give a talk on the topic of software development, I
chose to frame it in the context of an underlying philosophy. My stated goal
was to present a very effective process we use at my company,
[WegoWise](http://wegowise.com), to collaboratively produce high quality
software. But wouldn't it be more interesting, I thought, to ask *why* we chose to
have certain processes? Not the obvious and superficial why, but the deeper why
that delves into sociology, psychology, and ethics. The why that asks about the
actual *philosophy* behind what we do.

I think these *are* the interesting questions, because they have incredibly
interesting answers.

We are, as far as our development processes go at least, social anarchists.
This isn't a result of an explicit prior intention to apply an ideological
label. I doubt, in fact, if many of my colleagues would be willing to call
themselves anarchists. We merely built a set of processes based on shared
values--values that happen to exemplify social anarchist philosophy.

<p><a href='#sidebar1'>Sidebar: How do you define "philosophy"?</a></p>

## A concise definition of anarchy

Anarchy is grossly misunderstood, so it is necessary that I provide a brief
definition. The fundamental principle of anarchist thought is that the state
holds no moral authority over the individual, or over collectives of
individuals. An anarchist therefore seeks to abolish the state, at all levels.
It is, fundamentally, an anti-fascist ideology.

Anarchy is often confused with chaos, under the belief that there can be no
order without some form of authority. Instead, anarchism proposes that there is
a stable form of society wherein individuals govern themselves. There are many
schools of thought on how this might happen, often in strong contrast with one
another. Social anarchy outlines a system that is guided by a social compact
among people, predicated on community, reciprocity, and equality.

I am not aware of any historic examples of large anarchist societies. In the
case of social anarchy, it is easy to see why this is. The philosophy builds on
the idea that individuals do, in fact, respect one another, and wish to work in
a system of mutual aid. Individuals must possess a high level of equanimity for
their fellow man. As the size of a society becomes larger and more diverse,
this becomes an increasingly challenging requirement. Our cultures simply
haven't evolved to the point where people can be expected to possess such
traits at large scales.

The principles of social anarchy have, however, been very effective at small
scales. The Buddhist economic principles that Schumacher observed in Burma in
1955, for example, share many ideals of social anarchy. The recent Occupy
protests provide a good example of anarchist decision-making. In small
collectives with a culture of mutual respect, social anarchy is an attainable
(and, I believe, desirable) goal.

## Anarchy within a company culture

[WegoWise](http://wegowise.com) is a relatively small organization. Individuals
know each other well, have shared goals, and similar philosophies within the
domain in which we interact. For example, we believe that there is an artistry
to the work that we do, and that there is real value in pursuing the more
artful solution to a problem. If work is a vehicle for the mind, one ought to
work in a manner that expands the mind, rather than dulls it.

The culture of our team is defined in large part by how we operate as a
collective. Ideas originate from all directions, decisions are made based on
discussion and mutuality, and processes reflect a respect for the individual
even as they respond to the needs of the whole.

We have, therefore, the fundamentals prerequisites for a successful social
anarchy. However, we also operate within a larger context that places
constraints on what we can do. A business is it's own society from within, but
it also has to act as a member of an external society that is decidedly not
anarchist. So we impose a certain degree of structure, with leadership roles
and reporting relationships, and executive decisions that may not always be
made by consensus.

In many domains, though, we have much more control. Software development is one
of those domains, and within it, we may *choose* how we operate. And we choose
to be anarchists.

## Goals of a software development process

At last, to the topic at hand.

Software is a collaborative field. Groups of people work on large systems,
often with different ideas of how things should be done and without being able
to know what all the moving parts are at any given time. We design processes
to manage the complexity inherent in these dynamic environments.

We must design our processes to meet numerous goals. We require a reliable
product; an application that behaves the way we expect it to behave. We must be
able to improve that product over time, and scale our systems to meet higher
demands. And we have to make sure to do this in a sustainable and enjoyable
way--there must be joy in our work.

We can meet these goals through standard practices: automated testing, pair
programming, code reviews, regular communication and retrospectives. However,
such practices do not, in and of themselves, define a process. How do we
ensure such practices are followed in a consistent and meaningful fashion?

I posit that, in order to meet our design goals, we should like for our
development process to:

* Protect the codebase
* Preserve developer flexibility
* Encourage clear communication
* Foster learning

## A standard approach: Enforcing test-driven development

A thoroughly automated test suite is one of the best ways to meet at least some
of our goals. Proper testing gives developers confidence that making changes in
one section of a large and complex codebase will not break the application's
behavior in an unexpected manner. Tests allow developers to work without fear.

Test-driven development is an effective approach to ensuring tests get
written, and many organizations have therefore defined their processes around
it. This paradigm enforces that one must write tests first, watch them
fail, and then write the corresponding code. It can be taken a step further
to include multiple layers of testing, and an outside-in approach wherein one
writes higher-level tests before proceeding to low-level tests and finally to
writing code.

Enforcing test-driven development as a formal process is, I believe, an
undesirable approach because it reflects a fundamentally fascist ideology. This
process requires developers to train their minds to operate in very specific
ways. It therefore sets constraints not just on what a person does, but *how
they do it*. In broad terms, a centralized authority is asserting control over
the behavior of an individual within the privacy of their own mind and work.
What else would you call this, if not fascism?

My objections go beyond the philosophical to the practical. Test-driven
development is incredibly effective when we have very clearly defined goals and
know ahead of time what we wish to accomplish. In these cases, writing software
is pure implementation. Much of the time, however, software is more of an art
form. And the exploratory and artistic nature of the field is what creative
individuals thrive on; perhaps even find transcendent at times.  Requiring a
strict procedure at every step disincentivizes exploration because there is
extra overhead to trying things that don't work. For many individuals, it
dampens the joy of discovery. These creative individuals are the most valuable
assets any team can have. One ought not create a process that prevents them
from acting at their best.

<div id='laws_quotes'>
<blockquote>Societal laws
<span>ought to</span>
protect the commons
<span>and</span>
preserve individual liberty.</blockquote>
<blockquote>
Our team's process
<span>ought to</span>
protect the codebase
<span>and</span>
preserve developer flexibility.
</blockquote>
</div>

## Our anarchist approach

<p><span class='note'>The following is somewhat technical.</span></p>

At WegoWise, we follow an approach I refer to as *atomic commits*.  We use
`git` as our version control system, and rely on a specific branching model:
`master` always mirrors what is being run on production, and any
changes--whether they are trivial bug fixes or large features--are made on
branches. These branches are then merged into `master` when they are ready to
be deployed.

Such a strategy provides enormous freedom to the individual, because it clearly
defines boundaries:

<blockquote id='master_branches'>
<code>master</code> is the commons<br>
branches belong to the individual
</blockquote>

There is one shared, canonical codebase, which is presented to the public as
the official product. If an individual wishes to amend it, they affect
everyone. Therefore, we establish a system of self-governance in order to make
changes to this common resource. Style guides, code reviews, and QA processes
are among the guidelines established by the group.

So long as an individual is working on a separate branch, however, they can do
*whatever they want*. This is because until they want to merge into `master`,
they aren't affecting anyone else in any way. So what moral basis do others
have to force them to work according to some specific process?

Social anarchism relies on the idea that it is possible for individuals to
agree on acceptable social norms--the laws of society. Without a state agent,
however, how are we to police individuals who decide to violate these norms?
The answer lies in our presumption that we are dealing with well-intentioned
individuals who want to work together.

If someone disagrees with the guidelines that have been established, we seek to
understand the cause for their grievance, and give it an open public hearing.
The team discusses amongst themselves and decides how to amend the existing
guidelines to meet the concerns of the aggrieved individual.

We do, in fact, amended our processes on a regular basis using exactly this
approach.

## The rules of the commons: Atomic commits

We have established the following four rules for accepting commits into
`master`:

1. Every commit must make sense on its own
2. Every commit must do something meaningful
3. No commit may cause the test suite to fail
4. Every commit must include thorough tests for all code changes

Rules 1-4 define what I describe as atomic commits. Commits are atomic
according to the original Greek notion of being self-enclosed and, in some
sense, indivisible.

### Rules 1 &amp; 2: Communication and learning

It is commonplace for a developer to want to understand the history of how and
why a certain file, or a specific line of code, was modified. Reading through
the history for a codebase ought to be somewhat like reading a Hemingway novel.
Terse prose that flows together to tell a story. This encourages clear
communication and fosters learning.

When a developer is working on a branch, they will commonly commit code that is
a "work in progress". These incomplete changes make sense to the developer
while they are working, but don't convey any intention to others who might want
to understand the author's intention. Even the original author, when examining
their own code six months into the future, is unlikely to understand what their
exact thought process was in creating an incomplete set of changes.

When every commit is self-enclosed, the author is able to write a concise
summary of their higher-level goals in a way that conveys meaningful intent to
others. Requiring every commit to do something meaningful is a way of further
improving communication--less noise results in a cleaner signal.

By specifying a restriction on the logical consistency of commits, we provide
an avenue for developers to learn by reexamining their own work before
presenting it for review. To clarify this idea, consider the following analogy:

I step outside of my home and encounter a tourist who asks me for directions to
a particular restaurant I dined at just a week ago. I had gotten somewhat lost
trying to get there, and took a roundabout path before eventually arriving at
the restaurant. I could recollect for the tourist all of my twists and turns,
but those would be thoroughly confusing directions. Instead, I choose to map
out the path in my head, understand where I went wrong, and provide directions
based on the clearest route I can think of. In the process, I find that I have
also improved my own understanding of the geography around me.

<div id='maps'>
<img src='{{site.baseurl}}/images/2012-12-13/map1.png' alt='the long way'
class='before' />
<img src='{{site.baseurl}}/images/2012-12-13/map2.png' alt='oh, right'
class='after' />
<span class='arrow_box'></span>
</div>

When a developer reorganizes their work to present to others, they perform the
exact same mental process as described above: remapping the route they took to
make sense of their decisions, getting a more coherent picture of the landscape,
and perhaps discover a shorter and clearer path to reach the same destination.
This self-assessment of past work is a critically valuable learning tool.

### Rules 3 &amp; 4: Reliability and flexibility

The last two rules, that commits may not cause test failures and must be
bundled with thorough tests, clearly meet our objective of a codebase that
performs as expected. Equally important is the fact that they allow individuals
to choose *how* they will meet that objective.

In discussing test-driven development earlier, I stated that it is an effective
approach to testing. In fact, developers on our team often choose to follow a
test-driven approach while working. Our rules certainly allow that. But they
don't *require* it. It is also common to experiment with varying algorithms and
design patterns, and settle upon one before writing any tests at all. The
process of writing the tests may then reveal gaps in the earlier logic which
prompt changes in the code and further iterations.

Regardless of how an individual chooses to meet the rules, the important point
here is that the rules are placed on the *shared resources* where communal
agreement is the highest priority. There are no rules places on the developer
in the context of their own work.

## The final process

Adding up all of the discussion above, we arrive at a process that has two
distinct components: an internal approach that defines how an individual
chooses to tackle a problem, and an external set of steps where a developer
interacts with the community, and the rules of the commons are in play.

Note that the top row in this chart, representing the developer's internal
process, is a reflection of the most common set of steps a developer might
take, not a hard-and-fast set of rules.

<div id='process_chart'>
  <div class='row row1'>
    <em>Internal processes</em>
    <span class='step'>Formulate an approach</span>
    <span class='arrow right arrow1'>&nbsp;</span>
    <span class='step'>Write your code and tests</span>
    <span class='arrow right arrow2'>&nbsp;</span>
    <span class='step'>Organize your branch</span>
  </div>
  <span class='arrow down arrow3'>&nbsp;</span>
  <div class='row row2'>
    <span class='step'>Present code for review</span>
    <span class='arrow left arrow4'>&nbsp;</span>
    <span class='step'>Iterations based on feedback</span>
    <span class='arrow left arrow5'>&nbsp;</span>
    <span class='step'>QA &amp; deploy</span>
    <em>External processes</em>
  </div>
</div>

## Addendum

<p>The discussion above leaves out a number of details. After presenting this
topic to a group of developers, I received many questions, some of which I will
address here. If you have any others, please <a id='email'>email
me</a>.</p>


<p><em class='question'>Does someone oversee this process?</em></p>

No. The entire idea is that the team governs itself. Any individual can deploy
code, and every individual is expected to be responsible for making sure the
common rules are followed.

<p><em class='question'>How does this change if two developers are pair
programming?</em></p>

Replace all of the references to individuals in the process above with
references to the pair who are working together. The pair of developers may
decide amongst themselves how they want to structure their process, and who is
responsible for what.

<p><em class='question'>How do you deal with incredibly large features when you
have atomic commits?</em></p>

Atomic commits do not require that an entire feature be included in one commit.
Instead, it encourages the feature to be broken into logical, self-enclosed
chunks which each fit into one commit.

<p><em class='question'>Does this approach work when you have different skill
levels within a team? Don't inexperienced individuals need more
structure?</em></p>

Structure is vital when we learn new things. The Japanese principle of Shuhari,
describes the first stage towards mastery, Shu, as a phase in one must focus on
learning and obeying. There are [excellent
articles](http://alistair.cockburn.us/Shu+Ha+Ri) describing how this may be
applied to software development.

I agree entirely with the idea that one must learn first before one is able to
act, and that learning generally requires following existing practices.
Children are required to learn multiplication tables by rote, for example,
before they are able to grasp mathematical concepts more abstractly.

However, it is important to understand that there is, of course, a difference
between the situation of a child, and an inexperienced adult. One may say that
following a certain discipline is usually the most effective way to master an
art, and one individual may certainly suggest to another that following that
discipline might be beneficial to them.  However, it is incumbent upon the
individual who requires instruction to decide to relinquish control--no other
may take that control from them.

An organization, therefore, ought to focus on recruiting people who have a
desire to improve, suggesting to them approaches they might take, providing
them with the guidance and mentoring they may request, and making assessments
based on external performance.

<p id='sidebar1'><em class='question'>How do you define "philosophy"?</em></p>

I admit to being rather loose with my use of the term "philosophy" in this
piece. I interchange, to some extent, the terms *philosophy* and *ideology*,
which is not strictly appropriate.

My working definition of philosophy comes from the following outlook:

Every action we take as individuals reflects the philosophical construct by
which we lead our lives. Our awareness of these constructs, and our ability to
understand and modify the philosophies that guide us, determine the extent to
which we lead directed lives. The extent to which individuals direct their own
pattern of thought, in turn, determines the evolution of a thinking species.

Philosophy may refer to abstract disciplines, or practical ones, and there are
strong connections between the two: logic yields mathematics, and epistemology
guides how we think of scientific truth. Philosophy may be impersonal, but it
also includes the most deeply personal experiences we may have: the
contemplation of emptiness and reflections on the nature of the self. I count
the numerous fundamental questions that guide our daily experiences to be
legitimately described as realms of philosophical inquiry: What is the basis
for our social, political and economic systems? Why should we take one action
instead of another? How are we to construct the systems we live and work in?

<a href='#post'>Back to top</a>

<script>
document.getElementById('email').href='mailto:barunio@gmail.com'
</script>
