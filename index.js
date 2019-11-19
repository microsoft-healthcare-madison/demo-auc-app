"use strict";
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || '3001';
const login = `<a href="http://localhost:${port}/">login</a>`;

const CPT = {
  _FHIR_CODING_SYSTEM: 'http://www.ama-assn.org/go/cpt',
  CARDIAC_MRI: '75561',
  CT_HEAD_NO_CONTRAST: '70450',
  CTA_WITH_CONTRAST: '71275',
  LUMBAR_SPINE_CT: '72133',
  MRA_HEAD: '70544',
};

const SNOMED = {
  _FHIR_CODING_SYSTEM: 'http://snomed.info/sct',
  CONGENITAL_HEART_DISEASE: '13213009',
  HEADACHE: '25064002',
  LOW_BACK_PAIN: '279039007',
  OPTIC_DISC_EDEMA: '423341008',
  TOOTHACHE: '27355003'
};

class Reasons {
  static covers(subset, set) {
    if (subset.size > set.size) {
      return false;
    }
    for (const member of subset) {
      if (!set.has(member)) {
        return false;
      }
    }
    return true;
  }

  constructor(appropriate, notAppropriate) {
    this.appropriate = appropriate.map(x => new Set(x));
    this.notAppropriate = notAppropriate.map(x => new Set(x));
  }

  getRating(reasons) {
    if (this.appropriate.filter(s => Reasons.covers(s, reasons)).length) {
      return 'appropriate';
    }
    if (this.notAppropriate.filter(s => Reasons.covers(s, reasons)).length) {
      return 'not-appropriate';
    }
    return 'no-guidelines-apply';
  }
}

const cptReasons = {
  'no-procedures-for': new Reasons([[SNOMED.TOOTHACHE]], []),
  [CPT.CT_HEAD_NO_CONTRAST]: new Reasons([[SNOMED.HEADACHE, SNOMED.OPTIC_DISC_EDEMA]], []),
  [CPT.MRA_HEAD]: new Reasons([], []),
  [CPT.CTA_WITH_CONTRAST]: new Reasons([], [[SNOMED.CONGENITAL_HEART_DISEASE]]),
  [CPT.LUMBAR_SPINE_CT]: new Reasons([], [[SNOMED.LOW_BACK_PAIN]]),
  [CPT.CARDIAC_MRI]: new Reasons([[SNOMED.CONGENITAL_HEART_DISEASE]], []),
};

const app = express();
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
  if (request.session.loggedin) {
    response.redirect('/consult');
  } else {
    response.sendFile(path.join(__dirname + '/login.html'));
  }
});

app.get('/consult', function(request, response) {
  if (request.session.loggedin) {
    response.sendFile(path.join(__dirname + '/index.html'));
  } else {
    response.send(`Please ${login} to view this page!`).end();
  }
});

app.post('/evaluate', function(request, response) {
  if (!request.session.loggedin) {
    response.status(404).send(`You must ${login} to access this.`);
  } else {
    const reasons = cptReasons[request.body.procedure];
    const rating = reasons.getRating(new Set([request.body.indication]));
    response.status(200).send(rating);
  }
  response.end();
});

app.post('/auth', function(request, response) {
  const username = request.body.username;
  const password = request.body.password;
  if (username && password) {
    request.session.loggedin = true;
    request.session.username = username;
    response.redirect('/');
  } else {
    response.send('Please enter Username and Password!');
  }
  response.end();
});

app.listen(port);
