"use strict";
const auc = require('./auc');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = process.env.PORT || '3002';

const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', (_, response) => response.redirect('/consult'));

app.get('/consult', function(request, response) {
  response.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/evaluate', function(request, response) {
  const criterion = auc.criteria[request.body.procedure];
  const rating = criterion.getRating(new Set([request.body.indication]));
  response.status(200).send(rating).end();
});

app.listen(port);
