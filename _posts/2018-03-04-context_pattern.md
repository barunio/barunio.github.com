---
layout: post
title: Introducing the Context Pattern
custom_css: true
code: true
font1: Open+Sans:400,700
font2: Inconsolata
---
<div id='github-banner'>
  <a href="https://github.com/barunio/context-pattern" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:#64CEAA; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a><style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
</div>

<nav id="sidebar" markdown="1">
  <h4 class="toc_title">Context Pattern</h4>
  * seed list to be replaced by kramdown
  {:toc}
</nav>

Barun Singh
{: .author}

This page describes a new way to think about web application development,
specifically for Ruby on Rails applications. To do this properly, I’ll need to
provide a little bit of motivation, and present more than a trivially small
code snippet. Bear with me, I think you’ll find that it’s worth it. The pattern
I’m introducing here has been used in production on the
[WegoWise](https://www.wegowise.com) codebase for the past 5 years, with an
existing team of many members.


## Background: What determines code quality?

When we talk about writing “good” code, or reference code “quality”, what
exactly do we mean? A thorough discussion of this topic would need to delve
into the idea of software development as an art form, where quality and
aesthetics go hand-in-hand, and where the interplay between these notions
guides our cognitive processes. For now, though, I’ll put forward something
more practical and suggest that code quality is measured by the following
criteria:

* **Reliability:** Is the desired behavior produced?
* **Performance:** How optimized is the code for speed and resource management?
* **Consistency:** Do we follow similar conventions when possible in the
  codebase?
* **Understandability:** How easy is it to determine what the code is doing?
  Simplicity naturally follows as a goal when striving for understandability.
* **Readability:** How easy is it to actually read the lines of code?

Note that while readability and understandability are related, they are not the
same. A code may be structured in a manner that makes it easy to understand but
challenging to read, or vice versa.

So how do we know if we are meeting our goals for code quality? The better your
code meets the five criteria above, the more strongly you’ll be able to answer
the following three questions in the affirmative:

* Is it easy to debug the code?
* Is it easy to change the desired behavior or structure of the code?
* Is it pleasant to work with the code?

Below, I outline an example application written using common Rails idioms,
describe common anti-patterns, and work through how to refactor the code to
improve its quality. I'll first apply some well-known approaches, then show
how the context pattern improves things further.


## The Rabbit Adoption Agency Example

Suppose we’ve built a web app to help people adopt rabbits in need of homes.
The relevant models for us in this application are `User`, `Rabbit`, `Adoption`,
`AdoptionCenter`, `Coupon`, and `Referral`. An `Adoption` associates a `User` and `Rabbit`
together, and every `Rabbit` belongs to an `AdoptionCenter`. We’re going to look
specifically at the `RabbitAdoptionController#create` action. Here’s what happens
when a request hits this endpoint:

* We get the `User` from the params. This is done in an `ApplicationController`
  because it’s relevant across endpoints.
* We get the `Rabbit` being adopted from the params
* If the rabbit isn’t spayed/ neutered, we redirect to a different controller
* If there is a coupon code given in the params, we reduce the adoption fee
  accordingly
* We create an `Adoption` record in the database
* If there’s a referral hash in the params, we associate the `Referral` with the
  `Adoption`
* We increment a counter on the `AdoptionCenter`
* We show some details in the view, including the address of the adoption
  center. If the adoption center is a volunteer foster home, we don’t show the
  specific street address unless the User is verified, for privacy reasons.

### Controllers:

~~~ruby
class RabbitAdoptionController < ApplicationController
  def create
    @rabbit = Rabbit.find(id: params[:id])
    @adoption_center = @rabbit.adoption_center

    if !@rabbit.spayed_or_neutered?
      redirect_to new_spay_neuter_path(@rabbit) and return
    end

    @fee = @rabbit.adoption_fee
    if params[:coupon_code]
      @coupon = Coupon.find(params[:coupon_code])
      @fee -= @coupon.amount
    end

    if params[:referral_hash]
      @referral = Referral.find_by(hash: params[:referral_hash])
    end

    @adoption = Adoption.new(rabbit: @rabbit, user: @current_user, fee: @fee)
    Adoption.transaction do
      @adoption.save!
      @referral.update!(adoption_id: @adoption.id) if @referral
    end
  rescue ActiveRecord::RecordInvalid
    flash[:error] = "Something went wrong"
    render action: :edit
  end
end
~~~

~~~ruby
class ApplicationController < ActionController::Base
  before_action :get_current_user
  before_action :redirect_unless_logged_in

  def get_current_user
    @current_user = User.find_by(id: session[:user_id])
  end

  def redirect_unless_logged_in
    redirect_to new_session_path unless @current_user
  end
end
~~~

### Models:

~~~ruby
class Adoption < ActiveRecord::Base
  belongs_to :rabbit
  belongs_to :user

  after_create :adopt_rabbit

  def adopt_rabbit
    rabbit.adopt!
  end
end
~~~

~~~ruby
class AdoptionCenter < ActiveRecord::Base
  def display_name
    # `name` and `is_volunteer_foster_home` are both attributes of this model
    return name unless is_volunteer_foster_home?
    "Foster volunteer: #{name}"
  end
end
~~~

~~~ruby
class Rabbit < ActiveRecord::Base
  belongs_to :adoption_center

  def adopt!
    update!(adopted: true)
    adoption_center.increment!(:adoption_count)
  end
end
~~~

### Helper:

~~~ruby
module RabbitAdoptionHelper
  def adoption_center_address
    # `verified` is an attribute of the User model
    if @adoption_center.is_volunteer_foster_home? && !@current_user.verified?
      "#{@adoption_center.display_name}<br>"\
        "#{@adoption_center.city}, #{@adoption_center.state}"
    else
      "#{@adoption_center.display_name}<br>"\
        "#{@adoption_center.street_address}<br>"\
        "#{@adoption_center.city}, #{@adoption_center.state}"
    end
  end
end
~~~

### View:

~~~erb
<p>Congratulations, <%= @current_user.name %>! You've adopted a cute little
bunny in need, named <%= @rabbit.name %>. The bunny is located at:</p>

<p><%= adoption_center_address %></p>

<p>
  The adoption fee is $<%= fee %>.
  <% if @coupon %>
    (This includes a discount of $<%= @coupon.amount %> from your coupon)
  <% end %>
  You'll need to pay this when you go to pick up the rabbit.
</p>

<p>You will get an email with more information. Thanks!</p>
~~~


## Dissecting the code: Anti-patterns

The code in the previous section doesn’t do anything particularly out of the
ordinary as far as Rails conventions go, but it is full of anti-patterns. These
code smells, when applied to a much larger and more complex codebase, become
very challenging to deal with.

### Controllers with too much logic

Controllers are meant to direct requests with relatively minimal logic. In our
example, the controller is a full 18 lines of code for a single action, and is
instantiating numerous different objects. How easy was it to follow all the
different things that the controller action did? Controllers with this much
logic are neither understandable nor readable.

### Helper modules that contain logic

Rails helpers are modules that are automatically made available to views based
on naming conventions. This means the functions they contain do not have
explicit receivers, making them annoying to test. Relying on the helpers for
view logic commonly leads to taking shortcuts where object models are
discarded, and procedural convenience methods are written instead. This is what
is happening in our example.

### Callbacks in models that affect other models

We all know that modular abstractions with a clear separation of concerns makes
code easier to test and maintain. In our example, we are clearly violating this
goal in both our `Adoption` and `Rabbit` models.

### Models with view-specific logic

Well-written code reflects clear thought, and packing our domain models with
superfluous methods results in “junk-drawer” code that pollutes our
abstractions. The more we cram into our notion of a particular object, the
harder it is to understand what actually defines that object. This leads to a
snowball effect of increasing complexity over time. In our example, the
`AdoptionCenter#display_name` method exemplifies this code smell.

### Using instance variables in views

This is so common and uncontroversial that you’re probably surprised to see it
listed. But instance variables in views make your code hard to test, hard to
refactor, and prone to bugs. How do you know where among your controller stack
and helper modules an instance variable is defined? More importantly, instance
variables can be referenced even if they’re never set. This can lead to silent
failures, challenges when debugging nil values, and difficulties understanding
intent when refactoring code.


## Some improvement using existing patterns

There are a number of well known approaches we have available to us. In
particular, we can make use of service objects and presenters to resolve a few
of our code smells. Adding an `AdoptionCreationService` object can help us
enforce separation of concerns, and an `AdoptionCenterPresenter` can help us take
view-specific logic out of the helper and models.

Let’s look at the relevant code after we’ve made these changes. The methods
previously in the `Adoption` and `AdoptionCenter` models have been removed, so
those aren’t shown. The view is also unchanged from earlier so it isn’t
repeated.

### Controllers:
~~~ruby
class RabbitAdoptionController < ApplicationController
  def create
    @rabbit = Rabbit.find(id: params[:id])
    @adoption_center = @rabbit.adoption_center

    if !@rabbit.spayed_or_neutered?
      redirect_to new_spay_neuter_path(@rabbit) and return
    end

    if params[:coupon_code]
      @coupon = Coupon.find(params[:coupon_code])
    end

    if params[:referral_hash]
      @referral = Referral.find_by(hash: params[:referral_hash])
    end

    creator = AdoptionCreationService.new(
      rabbit: @rabbit,
      user: @current_user,
      coupon: @coupon,
      referral: @referral
    )
    created = creator.execute
    @fee = creator.fee

    if !created
      flash[:error] = "Something went wrong"
      render action: :edit
  end
end
~~~

~~~ruby
class ApplicationController < ActionController::Base
  before_action :get_current_user
  before_action :redirect_unless_logged_in

  def get_current_user
    @user = User.find_by(id: session[:user_id])
  end

  def redirect_unless_logged_in
    redirect_to new_session_path unless @user
  end
end
~~~

### Service Object:
~~~ruby
class AdoptionCreationService
  def initialize(rabbit:, user:, coupon:, referral:)
    @rabbit = rabbit
    @user = user
    @coupon = coupon
    @referral = referral
  end

  def adoption
    @adoption ||= Adoption.new(rabbit: @rabbit, user: @user, fee: fee)
  end

  def execute
    Adoption.transaction do
      adoption.save!
      @rabbit.adopt!
      @rabbit.adoption_center.increment!(:adoption_count)
      @referral.update!(adoption_id: adoption.id) if @referral
    end
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  def fee
    @fee ||= @rabbit.adoption_fee - @coupon.try(:amount)
  end
end
~~~

### Presenter:
~~~ruby
class AdoptionCenterPresenter
  def initialize(adoption_center:, user:)
    @adoption_center = adoption_center
    @user = user
  end

  def address
    if hide_street_address?
      "#{name}<br>#{@adoption_center.city}, #{@adoption_center.state}"
    else
      "#{name}<br>"\
        "#{@adoption_center.street_address}<br>"\
        "#{@adoption_center.city}, #{@adoption_center.state}"
    end
  end

  private

  def name
    return @adoption_center.name unless is_volunteer_foster_home?
    "Foster volunteer: #{@adoption_center.name}"
  end

  def hide_street_address?
    @adoption_center.is_volunteer_foster_home? && !@user.verified?
  end
end
~~~

### Model:
~~~ruby
class Rabbit < ActiveRecord::Base
  def adopt!
    update!(adopted: true)
    touch(:adopted_at)
  end
end
~~~

### Helper:
~~~ruby
module RabbitAdoptionHelper
  def adoption_center_address
    AdoptionCenterPresenter.new(
      adoption_center: @adoption_center,
      user: @user
    ).address
  end
end
~~~

## Where the existing approaches fail

Our “after” code is certainly an improvement from where we started. But the
controller doesn’t seem any less complex than before. In fact, it’s even harder
to understand and read now. Our helper module is simpler, but it’s still doing
non-trivial work by instantiating the presenter and calling a method on it. And
we’re still relying on instance variables to communicate among controllers,
helpers and views.

Fundamentally, something is missing from the way we’re organizing our code.
Let’s consider what we would ideally want from our object categories:

* **Controllers** should direct behavior for a request
* **Models** should represent specific domain concepts
* **Service** objects should perform specific actions
* **Presenters** should provide representations for the view
* **Helpers** should supply trivial logic-free conveniences

Here’s what’s missing from the above that leads to our code smells: Where do we
do the work of figuring out what to do from our params? Where do we instantiate
our service objects and presenters? Interpret results of methods called on
those objects? How do we communicate information to our views in robust ways?


## The context pattern

Context objects provide the missing piece. Specifically:

A Context Object is responsible for interpreting the current state of the
request, providing the context for a controller to do its work, and defining an
interface that may be referenced by views. Every request has exactly one
context object associated with it. This context is built up throughout the life
cycle of a request.
{: .context-definition}

To illustrate how this works, I’ll start by showing what our code example looks
like using the context pattern. This code requires adding the the
context-pattern gem to our gemfile:

~~~ruby
gem 'context-pattern'
~~~

In our new code, the models, service object and presenter are the same as
before and our helper module is now empty. The controllers and view have
changed, and now we have two context object classes. Here is the relevant new/
modified code:

### Controllers:

~~~ruby
class RabbitAdoptionController < ApplicationController
  def create
    extend_context :RabbitAdoptionCreate

    if !rabbit.spayed_or_neutered?
      redirect_to new_spay_neuter_path(rabbit) and return
    end

    create_adoption

    if !successful_adoption?
      flash[:error] = "Something went wrong"
      render action: :edit
    end
  end
end
~~~

~~~ruby
class ApplicationController < ActionController::Base
  include Context::Controller
  helper Context::BaseContextHelper

  before_action :set_application_context
  before_action :redirect_unless_logged_in

  def redirect_unless_logged_in
    redirect_to new_session_path unless logged_in?
  end

  def set_application_context
    extend_context :Application, params: params, session: session
  end
end
~~~

### Contexts:

~~~ruby
class ApplicationContext < Context::BaseContext
  view_helpers :current_user

  attr_accessor :session, :params

  def current_user
    User.find_by(id: session[:user_id])
  end
  memoize :user

  def logged_in?
    current_user.present?
  end
end
~~~

~~~ruby
class RabbitAdoptionCreateContext < Context::BaseContext
  view_helpers :adoption_center_address,
               :coupon_amount,
               :fee,
               :rabbit

  delegate :fee, to: :adoption_creator

  def adoption_center_address
    adoption_center.address
  end

  def create_adoption
    @success = adoption_creator.execute
  end

  def coupon_amount
    coupon.amount if coupon
  end

  def rabbit
    Rabbit.find(id: params[:id])
  end
  memoize :rabbit

  def successful_adoption?
    @success == true
  end

  private

  def adoption_center
    AdoptionCenterPresenter.new(rabbit.adoption_center)
  end
  memoize :adoption_center

  def adoption_creator
    AdoptionCreator.new(
      rabbit: rabbit,
      user: user,
      fee: fee,
      referral: referral
    )
  end
  memoize :adoption_creator

  def coupon
    Coupon.find(params[:coupon_code]) if params[:coupon_code]
  end
  memoize :coupon

  def referral
    Referral.find_by(hash: params[:referral_hash]) if params[:referral_hash]
  end
  memoize :referral
end
~~~

### View:

~~~erb
<p>Congratulations, <%= current_user.name %>! You've adopted a cute little
bunny in need, named <%= rabbit.name %>. The bunny is located at:</p>

<p><%= adoption_center_address %></p>

<p>
  The adoption fee is $<%= fee %>.
  <% if coupon_amount %>
    (This includes a discount of $<%= coupon_amount %> from your coupon)
  <% end %>
  You'll need to pay this when you go to pick up the rabbit.
</p>

<p>You will get an email with more information. Thanks!</p>
~~~

First, you’ll see our primary controller action is much simpler to understand.
It’s doing exactly what we want -- directing what the request should do. It’s
so simple that it almost reads like pseudocode.

The ApplicationController has two notable changes to allow us to use the
context pattern gem: it now includes Context::Controller and we have added a
helper `Context::BaseContextHelper` declaration.

You might also notice that our view doesn’t reference any instance variables
anymore. Those are all methods in our ERB syntax.

Then there’s the new stuff: the `extend_context` calls, and the context classes
themselves where we have all the logic that was previously in the controllers
and where we have `view_helpers` declarations.

## How the context code works

Let’s go step by step through the life cycle of the request (skipping the
irrelevant Rails internals). First the Rails router determines that the request
is for the `RabbitAdoptionController#create` action and we go to the
`ApplicationController`.

This `Context::Controller` module provides our `ApplicationController` with three
important pieces of functionality:
* It defines the `extend_context` method for us.
* It defines a “context stack” for us, via an instance variable named
  `@__context`, which is an instance of the `Context::BaseContext` class. It will
  become clear why I’m calling it a “context stack” later. To start, this
  object merely provides the scaffolding for us to define our own contexts.
* It includes some `method_missing` logic that I’ll get back to later.

The request then goes to the `ApplicationController`. Our first filter in
`ApplicationController` does this:

~~~ruby
extend_context :Application, params: params, session: session
~~~

This should be read as: "Add a new instance of the `ApplicationContext` class to
our context stack, and initialize it with these attributes: `{ params: params,
session: session }`." This means that the `@__context` variable will now reference
this new instance of `ApplicationContext`. That instance will have a reference to
the instance of `Context::BaseContext` that the `@__context` variable used to
define. Think of it somewhat like a linked list, where the most recent context
we’ve extended is at the top of the list.

Here’s how the structure of the `ApplicationContext` works:

* Any attributes we want to initialize the context with are specified via
  `attr_accessor` declarations.
* Any public methods defined in the context are available to the controller
* The `view_helpers` declaration specifies which methods are available to views
  later
* The memoize declaration does what it says, it memoizes the results of the
  method specified in the declaration. (The `context-pattern` gem includes the
  `memoizer` gem).

Our second filter in the  `ApplicationController` does this:
~~~ruby
  redirect_to new_session_path unless logged_in?
~~~
Here we can see that the `logged_in?` method is coming from the context.

Our request then goes to `RabbitAdoptionController` where the `create` action
starts with:
~~~ruby
extend_context :RabbitAdoptionCreate
~~~
This should be read as: “Add a new instance of the `RabbitAdoptionCreateContext`
class to our context stack”.

The next line of code is:
~~~ruby
  if !rabbit.spayed_or_neutered?
~~~
Here, the `rabbit` variable is coming from the `RabbitAdoptionCreateContext`
instance at the top of our context stack.

Our context stack now includes instances of `RabbitAdoptionCreateContext`,
`ApplicationContext`, and `Context::BaseContext`, in that order. The order is
very important here. Suppose that we tried calling `logged_in?` at this point in
the code. Here’s what would happen:

* The controller would look for the method and not find it. Remember how I
  mentioned that `Context::Controller` provides some method_missing logic? This
  is where it comes into play.
* The `method_missing` code in the gem causes us to look for the `logged_in?`
  method among the public methods provided by the  `RabbitAdoptionCreateContext`
  instance at the top of our context stack.
* The method won’t be found there.  But the context object itself contains
  `method_missing` logic that causes it to request the method from the next
  context in the stack. In this case, that will be the instance of
  `ApplicationContext`, where the method will be found.

After we go through the controller action code, we go to the view, where we
find `<%= current_user.name %>`.

In this code, `current_user` is a method being provided by `ApplicationContext`.
We are able to call this method from the view because of logic contained in
`Context::BaseContextHelper`. (which is declared to be a helper module in
`ApplicationController`). That helper module uses a similar approach as
`Context::Controller` to access methods from the context stack via
`method_missing`. The primary difference is that the logic in `BaseContextHelper`
only gives us access to context methods that are declared to be `view_helpers` in
our contexts. In other words, controllers are able to access all public methods
defined in our contexts, and views are able to access all methods in our
contexts that are public and also declared to be `view_helpers`.

## Understanding the context stack

This linked-list approach used to define the context stack is fundamentally
different from either inheritance or modules. Both of those are methods of
defining behaviors for and relationships among classes. One instance of a class
will have the same interface as another interface of that same class. The
context stack defines relationships between instances, not classes. In one part
of our codebase, an instance of `FooContext` may have an instance of `BarContext`
next in the stack whereas another place in the codebase may have an instance of
`BazContext` next in the stack.

### Directionality

The context stack enforces directionality. Suppose you had the following code
in a controller:
~~~ruby
extend_context :Foo
extend_context :Bar
~~~

A method defined in `BarContext` could make reference to a method defined in
`FooContext`, but not vice versa.

### Expected interfaces

A context object can, and in practice often will, reference methods that it
expects to be defined somewhere in the context stack already. For example, you
might have a UserEditContext that references the logged in user via a method
named current_user, which is defined earlier in the context stack. That’s a
sensible thing to do, because it’s a way of saying that the context for editing
the logged in user doesn’t make sense unless you’ve already established a
context in which there is a user logged in. Another way to think about this is
that the UserEditContext expects the context stack to provide it with an
interface that includes a current_user.

### Inability to override methods

Context objects can never overwrite public methods already available in the
context stack, with the exception of support for object decoration, described
next. The fundamental idea here is that good code shouldn’t change its mind.
For example, this is an antipattern:

~~~ruby
foo = 1
foo = 2 if blah?
~~~

The better code would be:

~~~ruby
foo = blah? ? 2 : 1
~~~

If you try to reason about code as though you were the request, going
step-by-step as we did earlier, you want to be able to understand things in a
clear, linear fashion. This means that in our rabbit adoption agency example,
we can’t (for example) have a method named `current_user` in the
`RabbitAdoptionCreateContext`. If we tried to define such a method, the gem would
raise an exception at runtime. This exception would be raised when the code
reaches the `extend_context :RabbitAdoptionCreate` code in our controller.

### Explicit support for object decoration

While we don’t want to be able to change the definition of an object entirely
as we move through a request, we certainly do want to be able to refine our
understanding of what that object is via decoration. This distinction is
important. You could imagine, for example, that `ApplicationContext` might
define `current_user` for us, but in some other specific controller action, we’d
later want to do the equivalent of `current_user =
UserWithAdminRights.new(current_user)`.

Contexts give us an explicit way to do this as follows:

~~~ruby
class FooContext < Context::BaseContext
  decorate :current_user, decorator: UserWithAdminRights
~~~

An example showing all capabilities of the decorate declaration would be
something like the following:

~~~ruby
class FooContext < Context::BaseContext
  decorate :current_user,
           decorator: UserWithAdminRights,
           args: [:bar, :baz],
           memoize: true

  def bar; end
  def baz; end
end
~~~

This allows us to do the equivalent of the following in our context (to be
clear, the code below would raise an exception):

~~~ruby
class FooContext < Context::BaseContext
  def current_user
    UserWithAdminRights.new(@parent_context.current_user, bar: bar, baz: baz)
  end
  memoize :current_user

  def bar; end
  def baz; end
end
~~~

If you were using the standard decorator pattern with something like
SimpleDelegator, the args would not be relevant. If you’re rolling your own
code for object decoration (as we do at WegoWise) you might find it useful.


## The `context-pattern` gem

If you'd like to try using the context pattern in an app, you can get started
easily via the [context-pattern gem](https://github.com/barunio/context-pattern).
It includes a README with usage details, and questions/ feedback are welcome
via Github issues and pull requests!

----

*Thanks to Joseph Method, Nathan Fixler, and Marc Tibbitts for providing
feedback and suggestions re: this writeup.*
