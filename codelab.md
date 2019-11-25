summary: Demo EHR Integrated AUC Guideline Consultation App
id: demo-auc-app
categories: cds-hoooks smart smart-web-messaging
environments: Web
status: Draft
feedback link: https://github.com/microsoft-healthcare-madison/demo-auc-app/issues
tags: cds-hoooks smart smart-web-messaging smart-launch pama auc qcdsm ple
authors: Carl Anderson

<!--- DEV NOTE
# Run this in a terminal to automatically re-extract the codelab when the source
# markdown is changed.

cd ~/code/googlecodelabs/site/
gulp serve --codelabs-dir=codelabs
CODELAB=../../../madison-healthcare-madison/demo-auc-app/codelab.md

while kqwait $CODELAB && claat export $_; do continue; done

--->

# Embed an External AUC Guideline Consultation App Into an EHR

## Codelab Examples

### What You'll Learn
- How to trigger the special syntax of a codelab, as processed by the `claat` tool.
- What each special feature *looks like*.
  - What You'll Learn
  - Tables
  - Infoboxes
  - Surveys
  - Download Button
  - Embedded iframes
  - Frequently Asked Questions
  - What We've Covered

When you use the magic H3 heading `### What You'll Learn` - the following unordered list will be rendered using green checkboxes instead of the default bullet points.

#### `codelab markdown`
```html
### What You'll Learn
- hi
- there
```

### Tables

Your codelab can use very simple markdown (or HTML) tables.

#### HTML-based
<table>
  <tr><td>one</td><td>two</td><td>nine</td><td>thirteen</td></tr>
  <tr><td>three</td><td>four</td><td>ten</td></tr>
  <tr><td>five</td><td>six</td><td>eleven</td></tr>
  <tr><td>seven</td><td>eight</td><td>twelve</td></tr>
</table>

#### Markdown-based
| This  | Is    | A      | Table    |
|-------|-------|--------|----------|
| one   | two   | nine   | thirteen |
| three | four  | ten    |          |
| five  | six   | eleven |          |
| seven | eight | twelve |          |

#### `codelab markdown`

```html

#### HTML-based
<table>
  <tr><td>one</td><td>two</td><td>nine</td><td>thirteen</td></tr>
  <tr><td>three</td><td>four</td><td>ten</td></tr>
  <tr><td>five</td><td>six</td><td>eleven</td></tr>
  <tr><td>seven</td><td>eight</td><td>twelve</td></tr>
</table>

#### Markdown-based
|-------|-------|--------|----------|
| one   | two   | nine   | thirteen |
| three | four  | ten    |          |
| five  | six   | eleven |          |
| seven | eight | twelve |          |

```

### Infoboxes

You can highlight a section of code as either a positive or a negative infobox.

<dt>positive</dt>
<p>This is a positive infobox.</p>

<dt>negative</dt>
<p>This is a negative infobox.</p>

#### `codelab markdown`

```html
<dt>positive</dt>
<p>This is a positive infobox.</p>

<dt>negative</dt>
<p>This is a negative infobox.</p>
```

<!--- This is an example codelab survey  --->
### Surveys

You can include a survey in the codelab which will create Google Analytics variables, which will collect survey response totals.

<dl><dt style="background-color:#cfe2f3;">Survey</dt>
<dd>
  <li>Example item 1</li>
  <li>Example item 2</li>
</dd></dl>

#### `codelab markdown`
```html
<dl><dt style="background-color:#cfe2f3;">Survey</dt>
<dd>
  <li>Example item 1</li>
  <li>Example item 2</li>
</dd></dl>
```

### Download buttons

You can create a special button to Download something (like a tagged github repo).
[Download v3.0](https://github.com/microsoft-healthcare-madison/demo-auc-app/archive/v3.0.zip)

Negative
: This currently doesn't work with the `claat` tool!  Instead the 'button' is shown as a download link.

### Embedded iframes
You can embed an iframe in a codelab by setting the `alt` attribute of an `img` element.

#### Example: embedded `https://glitch.com/~howoldisit`

<img alt="https://glitch.com/~howoldisit" />

#### `codelab markdown`
```html
<img alt="https://glitch.com/~howoldisit" />
```

### Frequently Asked Questions
- <https://stackoverflow.com/questions/43001894/google-codelab-mistake>
- <https://developer.android.com/courses/fundamentals-training/toc-v2>

When linking to stack-overflow (and a few other google-specific URLs) - the link icon is automatically inserted into the link.

#### `codelab markdown`

```html
### Frequently Asked Questions
- <https://stackoverflow.com/questions/43001894/google-codelab-mistake>
- <https://developer.android.com/courses/fundamentals-training/toc-v2>
```

### What We've Covered
- How to trigger the special syntax of a codelab, as processed by the `claat` tool.
- What each special feature *looks like*.
  - What You'll Learn
  - Tables
  - Infoboxes
  - Surveys
  - Download Button
  - Embedded iframes
  - Frequently Asked Questions
  - What We've Covered

When you use the magic H3 heading `### What We've Covered` - the following unordered list will be rendered using green checkboxes instead of the default bullet points.

#### `codelab markdown`
```html
### What We've Covered
- good
- bye
```

## Introduction
Duration: 10

**Welcome, student!**

This codelab is intended to teach you about the SMART launch API, CDS Hooks, and SMART Web Messaging by walking you through a coding exercise that uses those technologies.

#### Profile Audience

This guide is intended for programmers who wish to learn by doing.  You should already have a working knowledge of web app programing, access to a development machine, and about 2 to 4 total hours to dedicate to completing the whole codelab.

#### Prerequisites

This guide assumes you are already familiar with javascript and are comfortable with web programming concepts.  It also helps to understand the basics of `git`, but there will be example commands throughout to help you if you are new.  The provided codebase uses `javascript`, `node`, `npn`, and `express` - so some prior experience with those tools will be helpful, but is not required.  You are also free to re-write whole portions of the code in whatever framework you like (and please feel free to share your work with us)!

#### Major Milestones

You will start with an already-implemented form-entry app that evaluates the appropriateness of a potential advanced imaging order and displays a rating of either `appropriate`, `not-appropriate`, or `no-guidelines-apply`.

- v1: Make the app SMART-launch capable, enabling an EHR to launch it.
- v2: Create a CDS hook service to evaluate a *draft* order in an EHR, and show a link to the SMART app.
- v3: Enable the SMART app to update the draft order inside the EHR.

## PAMA
Duration: 20

**PAMA - Protecting Access to Medicare Act of 2014**

***"If we in the United States could lower the prices and per-capita volumes of our CT scans, MRIs, and just the top 25 high-volume-high-price surgical procedures to those of the Netherlands, for example, we would see savings of about $425 per capita, or a total of $137 billion."***

**[Ezekiel Emanuel](https://en.wikipedia.org/wiki/Ezekiel_Emanuel), on an [article published in JAMA, March 2018](https://jamanetwork.com/journals/jama/article-abstract/2674671)**

#### Note
This section has *lots* of background which explains *why* the [PAMA](https://www.cms.gov/Medicare/Medicare-Fee-for-Service-Payment/ClinicalLabFeeSched/PAMA-Regulations) imaging use case was chosen for this exercise.  If you aren't interested in PAMA, and are here purely to learn the technology, you can skip ahead to the next section.  However, it might help to take at least *a few* minutes to skim this material, just to get the gist of what problem is being solved.

#### *Warp* Ahead

If you already have a good grasp of the SMART launch process, and you would like to do a lot more than *skip* ahead, you can **warp** ahead and begin the process at CDS hook implementation by checking out the code at `v2.0` in the repo and jump to [section v2](Write A CDS Hook).
TODO: get the section link working for the [section 2] link above.

There's even an analogous git tag which will give you the **final** solution at `v3.0`.  This is fine if you just want to quickly have a working copy of the app to play with, but if you're here to learn - I recommend finding time to do the full codelab.

### PAMA
New PAMA imaging requirements are taking effect, starting on January 1st, 2020.  The American College of Radiology has put out some very helpful media to explain why this is important, which I recommend checking out for a few minutes.

#### Links

- <https://www.acr.org/-/media/ACR/Files/Clinical-Resources/Clinical-Decision-Support/RSCAN-PAMA_flyer.pdf?la=en>

- <https://www.acr.org/Clinical-Resources/Clinical-Decision-Support>

#### PAMA Timeline

##### 2020
Starting in 2020, providers in the US who order diagnostic advanced imaging (CT, MRI, nuclear medicine, and PET scans) will need to provide *evidence* that they have consulted *best practice guidelines* for appropriate use of that technology *while they are still at the point of order entry*.

##### 2021
Failure to submit a claim for imaging that has this evidence, starting in 2021, may *prevent* reimbursement (for Medicare part B claims) for furnishing providers (who are typically radiologists).

##### 2022
Ordering providers who have a *consistently* poor history of ordering "low value" diagnosic imaging may then be subject to mandatory prior authorization before placing image orders for Medicare patients starting in 2022.  Some of those rules are TBD, depending on how the first two years go, though.

#### Apropriate Use Criteria (AUC)
In short, for software to determine whether an imaging technique is *apropriate* or not for a given diagnosis, several groups of specialists have been developing *apropriate use criteria* and publishing that criteria for the industry to adopt into the EHR workflow.  These AUC are regularly improved, updated, and re-published.

TODO: inline-link to AUC above

#### Qualified CDS Mechanisms (QCDSM)
The software providers who use this criteria, the QCDSM vendors, must provide access to best practice guidelines for a wide spectrum of medical care areas.  For PAMA imaging, we are interested in the radiology imaging AUC and we have prepared a simple example of QCDSM guideline consultation software.  However, a QCDSM must use more than one published set of AUC in their software, and have a method of updating their AUC periodically.  As such, the software can be quite complex, and is often implemented as a stand-alone web service.

TODO: inline-link to the list of QCDSMs

### Frequently Asked Questions

#### Quesion
Why are CDS Hooks important for PAMA?

#### Answer
To satisfy radiologist claims to CMS, the original order must include evidence that guidelines were consulted at the point of order entry.  This means, while the provider is still using the EHR, they must also be consulting a guideline app.  By using CDS Hooks, we can provide a link to the app as soon as it's relevant to them (like when they're placing an order for advanced imaging).

#### Question
Why is SMART Web Messaging important for PAMA?

#### Answer
Because the logic to determine when a service is or isn't appropriate is complex, these are often implemented in stand-alone web-based applications.  To enable those applications to **update** the currently draft order, we need SMART Web Messaging.  With SMART Web Messagine we can send data and actions back into the EHR, securely and easily.

## Exercise Outline
Duration: 5

You are provided with a very simple, but working, guideline consultation app.  In PAMA parlance, this would be software from a Qualified CDS Mechanism, or a QCDSM.

TODO: insert a screenshot of the starting app.

### SMART Launch

You will add SMART launch capabilities to the app, allowing it to be launched by the EHR and to receive EHR data directly through the SMART launch client.

TODO: insert a screenshot of the app, pre-populated with patient demographic data.

### CDS Hooks

Once the app is capable of a SMART launch, you will write a CDS Hook service to alert ordering providers when they have made an order selection that is outside of guidelines.  The alert will give them a helpful link to click on, which will launch the app *within the EHR*.  The app will read context from the EHR and use that to pre-populate the appropriate fields in its form, saving the clinician time and mental effort.

TODO: insert some images of the cards

### SMART Web Messaging

Finally, a new button will be added in the app that will be able to update the draft order items with the current selection.  Upon update, evidence of guideline consultation will be attached to the order, before closing the app, returning the user to the order entry screen in the EHR.

TODO: insert an image of the embedded app.

### Frequently Asked Questions

QUESTION: Which EHRs currently support the technologies required to enable these services?

ANSWER: Currently, Epic and T-System have implemented the required CDS hooks to enable this.  Cerner has committed to doing this, though, and it's not a matter of if, but of when.

## Prerequisites
Duration: 5

This guide assumes you already know some javascript and are familiar with web programming concepts.  It helps to be familiar with `git`, even though most `git` commands are provided when needed.

You must have a development machine the following installed:

- `git`
- `node`
- `npm`

TODO: link to guides for installing node, npm, and git.

### Frequently Asked Questions

#### Question
How do I install X?

#### Answer
- `git`: [download](https://git)
- `node`: [download](https://node)
- `npm`: [download](https://npm)

TODO: set these links

QUESTION: Can I use a virtual machine to do this?

ANSWER: Yes!
TODO: can a pool of virtual machines in azure be allocated for this???

## Getting Started
Duration: 15

```sh
git checkout --orphan demo ...  # TODO: get the right command here
cd demo-auc-app
npm install
```

TODO: insert a screenshot of this command line sequence working

The demo app is now ready to be started using this command

```sh
npm run server  # TODO: confirm this
```

To view the app, visit this URL: <http://localhost:3000>

EXERCISE: what is the rating of the following combination of demographics
- 4yo, male, lower back pain, and lumbar spine CT
- 98yo, female, congenitive heart failure, cardiac mri
- 29yo, female, headache, ct scan without contrast materials
- any of the above with a missing field

### Frequently Asked Questions

#### Question

#### Answer

## Enable SMART launch
Duration: 60

With the SMART launch API, the app will be able to securely read data from the EHR using the credentials of the clinician.  The provider will not need to remember a separate username and password to use the app anymore, and the app will be able to pre-load form fields using the available context in the EHR.

This will reduce user errors, save the user time, and spare them some frustrations.

### SMART Launch Documentation

TODO: make sure the launch `state` value is being used appropriately in demo code. :B
<http://www.hl7.org/fhir/smart-app-launch/#app-protection>

There is a very handy javascript library to enable easy configuration of SMART launches from the app.
<http://docs.smarthealthit.org/client-js/>

EXERCISE: Consult the link above, and create a `launch.html` endpoint.

TODO: reveal a solution `launch.html` endpoint and confirm that student solution is correct.
- Are the scopes correct?
- What is the value of the client_id (AND WHAT SHOULD IT BE???)

More information about scopes.
<http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html>

### The SMART App Launcher

To test the new launch endpoint, we can use a free, open source tool called the SMART App Launcher.
<http://launch.smarthealthit.org/>

EXERCISE: Visit the site and enter the path to your `launch.html` endpoint.  Click the green Launch App button to test.

#### Troubleshooting & Caveats

PROBLEM: I only see a white screen.

ANSWER: You may have entered an `https`, rather than an `http`, endpoint url.  Try changing it to `http`.


- EXERCISE: Add SMART launch url to the app
- TODO: Outline the requirements for pre-populating the age and gender in form.
- TODO: Link to the SMART launch documentation.
- EXERCISE: Complete the SMART launch
- EXERCISE: Extract the patient and provider from the client
- TODO: Provide the code to apply the data to the form
- TEST: Ask user to launch from SMART App Launcher with a default patient, default provider, both, neither, etc.
- EXERCISE: Remove legacy login code.

### Frequently Asked Questions

## Write a CDS hook

Duration: 90


Outline

- TODO: Show the design goals.
- TODO: Link to the CDS hooks documentation.
- TODO: Explain the discovery endpoint.
- EXERCISE: Ask user to write a new discovery endpoint.
- TODO: Introduce the CDS Hooks Sandbox
- EXERCISE: Ask user to add their service in the sandbox.
- TODO: Link to the Cards documentation
- TODO: Provide the refactored auc.js code.
- EXERCIES: Ask user to insert it, removing old code.
- TODO: Provide a simple template card
- EXERCISE: Add severity & custom icon to the card.
- TEST: Ask user to trigger the app by selecting certain criteria in the sandbox.

### Frequently Asked Questions

## SMART Web Messaging

Duration: 60

Outline

- TODO: introduce the design goals (show pictures of the wanted UI).
- TODO: link to the documentation.
<https://github.com/smart-on-fhir/smart-web-messaging>

- EXERCISE: Serialize the draft order, saving into the card.link.appContext
- EXERCISE: Ask user to deserialize the draft order in the index.html client context
- TODO: Provide the code to update the html using the client context
- TODO: Link to the SMART Web Messaging docs
- EXERCISE: Ask user to implement the closeApp function using window.postMessage
- TODO: provide the code to apply auc logic to the form (the Evaluate button)
- EXERCISE: Ask user to implement the updateApp function
- TEST: confirm that updates in the launched app update the cds hooks sandbox

### Frequently Asked Questions

## Bonus Exercies

These are optional exercises that you are welcome to take on, if you chose.

### `auc.js`

Update the logic to include more criteria.

### App Client Refresh

When the app gets a token from the SMART launch API, that token eventually will timeout.  The UI could give the user an option to request a refresh before it expires, or at least indicate in the UI when the token has expired (with a message like "EHR token has expired - please reload").

### Frequently Asked Questions
