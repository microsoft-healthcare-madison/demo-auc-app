summary: Demo EHR Integrated AUC Guideline Consultation App
id: docs
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


# To PRINT this codelab, refer to Marc's instructions here:
# https://groups.google.com/forum/#!topic/codelab-authors/pnnY50o82Qw

# Be sure to update the URL variable to 'http://localhost:8000/codelabs/'
--->

# Embed an External AUC Guideline Consultation App Into an EHR

## Introduction
Duration: 10

### Welcome, student!

This codelab is intended to teach you about the [SMART launch framework](http://www.hl7.org/fhir/smart-app-launch/), [CDS Hooks](https://cds-hooks.org/), and [SMART Web Messaging](https://github.com/smart-on-fhir/smart-web-messaging) by walking you through a coding exercise that uses those technologies.

#### Profile Audience

This guide is intended for programmers who wish to *learn by doing*.  You should already have a working knowledge of web programing, access to a development machine, and about 2 to 5 total hours to dedicate to completing the whole codelab.  Your completion time will vary based on your familiarity with Javascript, web programming concepts, and the API in general.

#### Prerequisites

This guide assumes you are already familiar with javascript and are comfortable with web programming concepts.  It also helps to know the basics of `git`, but there will be example commands throughout for convenience.  The provided initial codebase uses `javascript`, `node`, `nvm`, `npm`, and `express` - so some prior experience with those tools will be helpful, but not required.  JavaScript in the browser and in Node.js, and the express Web framework for Node.js

#### Contributing

As always, you are free to re-write entire portions of the code in whatever framework you like (and please feel free to share your work with us)!

The codelab has a wiki which should help you decide how to best contribute:
<https://github.com/microsoft-healthcare-madison/demo-auc-app/wiki>

Also, take notice of the [Report a mistake](https://github.com/microsoft-healthcare-madison/demo-auc-app/issues) link that appears in the lower left corner of each page!

#### Major Milestones

You will start with an already-implemented form-entry app that evaluates the appropriateness of a potential advanced imaging order and displays a rating of either `appropriate`, `not-appropriate`, or `no-guidelines-apply`.

- v1: Make the app SMART-launch capable, enabling an EHR to launch it.
- v2: Create a CDS Hooks service to evaluate a *draft* order in an EHR, and show a link to the SMART app.
- v3: Enable the SMART app to update the draft order inside the EHR.

## PAMA
Duration: 20

### PAMA - Protecting Access to Medicare Act of 2014

<dt>Negative</dt>
<dd>
***"If we in the United States could lower the prices and per-capita volumes of our CT scans, MRIs, and just the top 25 high-volume-high-price surgical procedures to those of the Netherlands, for example, we would see savings of about $425 per capita, or a total of $137 billion."***
<p>
<p>
**[Ezekiel Emanuel](https://en.wikipedia.org/wiki/Ezekiel_Emanuel), on an [article published in JAMA, March 2018](https://jamanetwork.com/journals/jama/article-abstract/2674671)**
</dd>

#### Skip Ahead
This section has *lots* of background which explains *why* the [PAMA](https://www.cms.gov/Medicare/Medicare-Fee-for-Service-Payment/ClinicalLabFeeSched/PAMA-Regulations) imaging use case was chosen for this exercise.  If you aren't interested in PAMA, and are here purely to learn the technology, you can skip ahead to the next section.  However, it might help to take at least *a few* minutes to skim this material, just to get the gist of what problem is being solved.

#### **Warp** Ahead

If you already have a good grasp of the SMART launch process, and you would like to do a lot more than *skip* ahead, you can **warp** ahead and begin the process at CDS Hooks implementation by checking out the code at `v2.0` in the repo and advancing to the section called **Write a CDS Hooks Service** in this codelab.

There's another git tag, `v3.0`, for the **final** solution.  Check out this version of the code if you just want to play with a working copy of the app.  However, if you're here to learn, it is recommended that you find time to do the full codelab.

### PAMA Imaging
New PAMA imaging requirements are taking effect, starting on January 1st, 2020.  The American College of Radiology has put out some very helpful media to explain why this is important.

- <https://www.acr.org/-/media/ACR/Files/Clinical-Resources/Clinical-Decision-Support/RSCAN-PAMA_flyer.pdf>
- <https://www.acr.org/Clinical-Resources/Clinical-Decision-Support>

#### Timeline

| Year | What's Planned |
|------|----------------------------------------------------------------|
| 2020 | Starting in 2020, providers in the US who order diagnostic advanced imaging (CT, MRI, nuclear medicine, and PET scans) will need to provide *evidence* that they have consulted *best practice guidelines* for appropriate use of that technology *while they are still at the point of order entry*. |
| 2021 | Failure to submit a claim for imaging that has this evidence, starting in 2021, may *prevent* reimbursement (for Medicare part B claims) for furnishing providers (who are typically radiologists). |
| 2022 | Ordering providers who have a *consistently* poor history of ordering "low value" diagnosic imaging may then be subject to mandatory prior authorization before placing image orders for Medicare patients starting in 2022.  Some of those rules are TBD, depending on how the first two years go, though. |

#### Apropriate Use Criteria (AUC)
In short, for software to determine whether an imaging technique is *apropriate* or not for a given diagnosis, several groups of specialists have been developing *apropriate use criteria* and publishing that criteria for the industry to adopt into the EHR workflow.  These AUC are regularly improved, updated, and re-published.

#### Provider Led Entities (PLE)
The groups of experts and specialists who decide what is and isn't appropriate are called *Provider Led Entities*.  They develop the AUC out in the open and publish it reqularly for consumption by software vendors who provide CDS.

#### Qualified CDS Mechanisms (QCDSM)
The software providers who use this criteria, the QCDSM vendors, must provide access to best practice guidelines for a wide spectrum of medical care areas.  For PAMA imaging, we are interested in the radiology imaging AUC and we have prepared a simple example of QCDSM guideline consultation software.  However, a QCDSM must be able to use more than one published set of AUC in their software, and have a method of updating their AUC periodically (See pages 4 and 5 [here](https://www.cms.gov/Outreach-and-Education/Medicare-Learning-Network-MLN/MLNProducts/Downloads/AUCDiagnosticImaging-909377.pdf) for details).  As such, the QCDSM software can be quite complex, and is often implemented as a stand-alone web service.

### Frequently Asked Questions

#### Why are *CDS Hooks* important for PAMA?
<dt>Positive</dt>
<dd>To satisfy a radiologist's claim to CMS, the original order must include evidence that guidelines were consulted at the point of order entry (by the *ordering provider*).  This means that, while the ordering provider is still using the EHR, they must also be consulting guidelines for appropriate use.  By using *CDS Hooks*, the EHR can consult a guideline service automatically, as soon as it's relevant -- sharing results or a link to the guideline app if further interaction is needed.
</dd>

#### Why is *SMART Web Messaging* important for PAMA?
<dt>Positive</dt>
<dd>Because the logic to determine *when* a service is or isn't appropriate can be very complex, this logic is often implemented in stand-alone web-based applications.  To enable those applications to **update** the current *draft* order, we need SMART Web Messaging.  With SMART Web Messaging, we can easily and securely send data and actions *back* into the EHR.</dd>

## Example App
Duration: 2

You are provided with a very simple, but working, guideline consultation app.  In PAMA parlance, this would be software from a Qualified CDS Mechanism, or a QCDSM.

Below is an embedded version of the app in its original state.  The idea is that clinicians would use this tool alongside their EHR when consulting guidelines.  The app would provide them some kind of evidence code which they could copy and paste back into the EHR before signing an order.

Feel free to explore the app to get a sense of how it works.  Any non-empty username and password will allow you to use the app - the login is totally fake.

![https://glitch.com/embed/#!/embed/jewel-chevre?path=package.json&previewSize=100](v1)

## Exercise Outline
Duration: 5

### SMART Launch

You will add SMART launch capabilities to the app, allowing it to be launched by the EHR and to receive EHR data directly through the SMART launch client.

### CDS Hooks

Once the app is capable of a SMART launch, you will write a CDS Hooks service to alert ordering providers when they have made an order selection that is outside of guidelines.  The alert will give them a helpful link to click on, which will launch the app *within the EHR*.  The app will read context from the EHR and use that to pre-populate the appropriate fields in its form, saving the clinician time and mental effort.

#### Example Cards

![example-cards](docs/img/example_cards.png)

### SMART Web Messaging

Finally, a new button will be added in the app that will be able to update the draft order items with the current selection.  Upon update, evidence of guideline consultation will be attached to the order, before closing the app, returning the user to the order entry screen in the EHR.

**TODO**: insert an image of the embedded app.

### Frequently Asked Questions

#### Which EHRs currently support the technologies required to enable these services?

<dt>positive</dt>
<pre>Currently, very *few* EHR vendors have implemented the required CDS Hooks to enable this (*T-Systems is a notable exception*).  Cerner has committed to doing this, though, and it's not a matter of if, but of when.  Epic is also 'working on it.'

While this may seem like a negative thing, the other way to see the situation is that any QCDSM vendor who is *ready* with product when CDS Hooks *does* become widespread will have the mover's advantage.  Also, there is currently relatively low pressure for an EHR vendor to get 'caught up' with competitors (but that should be changing rapidly in 2020).

In other words, there is still time to get ready!

For a list of vendors who support CDS Hooks, please refer to this:
<https://github.com/argonautproject/cds-hooks/wiki/Readiness-and-Testing-Matrix>
</pre>

## Prerequisites
Duration: 5

You must have a development machine with the following:

| Tool  | Download | Purpose |
|-------|----------|---------|
| `git` | [Download](https://git-scm.com/downloads) | Needed to check out the initial codebase. |
| `nvm` | [Download](https://github.com/nvm-sh/nvm) | RECOMMENDED to manage different installed versions of `node`. |
| `nvm-windows` | [Download](https://github.com/coreybutler/nvm-windows/releases) | WINDOWS version of `nvm`. |
| `npm` | [Download](https://nodejs.org/en/download/) | Needed to install the server dependencies and run it locally. |

Positive
: This guide was developed using `node v11.0.0`, but any version higher than that should also work.

### Links
- <https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/>

### Frequently Asked Questions
- <https://stackoverflow.com/questions/16904658/node-version-manager-install-nvm-command-not-found>
- <https://stackoverflow.com/questions/9755841/how-can-i-change-the-version-of-npm-using-nvm>
- <https://stackoverflow.com/questions/34810526/how-to-properly-upgrade-node-using-nvm>


## Getting Started
Duration: 15

### Code Repository

The companion source code for this codelab is currently at:
<https://github.com/microsoft-healthcare-madison/demo-auc-app>

### Clone v1.0

To begin this codelab, begin by cloning the repository *at* the initial version, which is `v1.0`.

```bash
mkdir ~/codelab
cd ~/codelab
git clone --branch v1.0 git@github.com:microsoft-healthcare-madison/demo-auc-app.git
cd demo-auc-app
npm install
```

The demo app is now ready to be started using this command:

```sh
npm run demo
```

To view the app, visit this URL: <http://localhost:3001>

#### Login
You can use any non-empty username and password to log in to the app.

![login](images/dr_brown_login.png)

### Exercises
To get you familiar with the app and how it works, please launch the app and use it to rate the following combinations of demographics.

| Age | Gender | Indication               | Procedure                          |
|-----|--------|--------------------------|------------------------------------|
| 4   | male   | lower back pain          | lumbar spine CT                    |
| 98  | female | congenital heart disease | cardiac mri                        |
| 29  | female | headache                 | ct scan without contrast materials |

Be sure to *also* try any of the above tests, but with a missing field.  The app should require you to enter a value for each field (without doing any *additional* sanity checking, though).

### Frequently Asked Questions

#### I see this when trying to run the demo: `npm ERR! code ENOENT`

Negative
: Be sure you run `npm install` inside the `demo-auc-app` directory that you cloned from git.  After that completes, *then* run `npm run demo` and visit <http://localhost:3001>.

#### This site can't be reached.

Negative
: Be sure you ran `npm run demo` to start the local server before visiting the app at <http://localhost:3001>.

#### This site can’t provide a secure connection.

Negative
: You may have typed `https` instead of `http` in the URL.  You must use `http` for this.

## Enable SMART Launch
Duration: 30

With the [SMART App Launch Framework](https://www.hl7.org/fhir/smart-app-launch/), the app will be able to securely read data from the EHR using the credentials of the clinician (through OAuth2 openid connect).  The provider will not need to remember a separate username and password to use the app anymore, and the app will be able to pre-load form fields using the available context in the EHR.

This will reduce user errors, save the user time, and spare them some frustrations.

### SMART Launch Documentation

There is a very handy javascript library to enable easy configuration of SMART launches from the app.
<http://docs.smarthealthit.org/client-js/>

#### EXERCISE 1
Positive
: Consult the link above, and create a `launch.html` endpoint.

Negative
: *Confused?*  Part of the goal of this codelab is to get you familiar with using the documentation, so there will be minimal hand-holding throughout.

Here are a couple of hints, in case this seems like a vague request.  

- You may need to use the `npm` command to install the library.
- Once installed, you will want to create an endpoint 'page' for use in a browser using the 'As Library' approach, rather than the 'As Module' approach.

<dt>negative</dt>
<div>SPOILER
This is *one* possible solution.
IGNORE THIS: if you want the experience of implementing it yourself.
```html
<!-- launch.html -->
<!DOCTYPE html>
<html>
  <head>
    <script src="./node_modules/fhirclient/build/fhir-client.js"></script>
    <script>
    FHIR.oauth2.authorize({
      client_id: "demo_auc_guideline_consultation_app",
      scope: "patient/*.read openid profile"
    });
    </script>
  </head>
  <body>Loading...</body>
</html>
```
</div>

#### Scopes
More information about scopes can be found here.
<http://www.hl7.org/fhir/smart-app-launch/scopes-and-launch-context/index.html>

#### EXERCISE 2

Positive
: Make this `launch.html` page available on port `8899` on your local machine.

Some hints:

- Consider using the `http-server` package for `npm` for a simple, easy to set-up, web server.
- Add an entry to your `package.json` file so you can invoke `npm run launch` to run the launcher.

<dt>negative</dt>
<div>SPOILER
Add this to `package.json`
```json
...
  "scripts": {
    "launch": "http-server -p 8899 -c-1",
...
```

Run this on the command-line:
```bash
npm install http-server
npm run launch
```

You should now be able to visit <http://localhost:8899> to have it launch the app, bypassing the login screen.
</div>

## Test SMART Launch
Duration: 5

### The SMART App Launcher

To test the new launch endpoint, we can use a free, open source tool called the SMART App Launcher.
<http://launch.smarthealthit.org/>

#### EXERCISE

Positive
: Visit the site and enter the path to your `launch.html` endpoint.  Click the green Launch App button to test.

If it worked correctly, you should see the app launched within a mock EHR session and you should not have been prompted to enter a username and password.  You should have been prompted to pick a provider and also pick a patient.

![provider picker](images/smart_launch_provider_picker.png)

![patient picker](images/smart_launch_patient_picker.png)

![launched](images/smart_launched_app.png)

#### Notice
If you had configured your launch URL to have a pre-selected patient, you would not have seen the patient picker and the patient name listed at the top and bottom edges of the Simulated EHR would have been filled in automatically using that patient; however, the age and gender would not automatically be populated in the form fields.  We must first modify the HTML to do that, which will happen in the next section.

### Frequently Asked Questions

#### I only see a white screen within the Simulated EHR panel.

Negative
: You may have visited <https://launch.smarthealthit.org/> instead of <http://launch.smarthealthit.org/>.  Notice the difference is `http` versus `https`.  Try again using `http` to visit the smart launcher.

#### I see an error: localhost sent an invalid response.

Negative
: You may have entered an `https`, rather than an `http`, in your endpoint url.  Try changing it to `http` and re-launching.

#### I was prompted with the original login screen.

Negative
: Be sure your launch URL includes the full `launch.html` portion, and not just a path to the webserver root.

#### I was not prompted to select either a patient or a provider.

Negative
: Be sure your launch URL includes the full `launch.html` portion, and not just a path to the webserver root.  Also confirm that you're running the `v1.0` branch of the code (not `master` or `v2.0`).

## Using the SMART Launch Client
Duration: 20

- TODO: Outline the requirements for pre-populating the age and gender in form.
- TODO: Link to the SMART launch documentation.
- EXERCISE: Complete the SMART launch
- EXERCISE: Extract the patient and provider from the client
- TODO: Provide the code to apply the data to the form
- TEST: Ask user to launch from SMART App Launcher with a default patient, default provider, both, neither, etc.
- EXERCISE: Remove legacy login code.

### Frequently Asked Questions

## Write a CDS Hooks Service

Duration: 90


Outline

- TODO: Show the design goals.
- TODO: Link to the CDS Hooks documentation.
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
- TEST: confirm that updates in the launched app update the CDS Hooks sandbox

### Frequently Asked Questions

## Bonus Exercies

These are optional exercises that you are welcome to take on, if you chose.

### `auc.js`

Update the logic to include more criteria.

### App Client Refresh

When the app gets a token from the SMART launch API, that token eventually will timeout.  The UI could give the user an option to request a refresh before it expires, or at least indicate in the UI when the token has expired (with a message like "EHR token has expired - please reload").

### Frequently Asked Questions

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

#### IMPORTANT!
<dt>Negative</dt>
<p>Unfortunately, the background color value (`#cfe2f3`) is a *magic* attribute value.  Without this *exact* color value, the Survey object will not work as intended.</p>

### Download buttons

You can create a special button to Download something (like a tagged github repo).
[Download v3.0](https://github.com/microsoft-healthcare-madison/demo-auc-app/archive/v3.0.zip)

Negative
: This currently doesn't work with the `claat` tool!  Instead the 'button' is shown as a download link.

### Embedded iframes
You can embed an iframe in a codelab by setting the `alt` attribute of an `img` element.

#### Example: embedded `https://glitch.com/~howoldisit`

![https://glitch.com/embed/#!/embed/jewel-chevre?path=package.json&previewSize=100](Glitch iframe)

#### `codelab markdown`
```html
![https://glitch.com/embed/#!/embed/jewel-chevre?path=package.json&previewSize=100](Glitch iframe)
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
