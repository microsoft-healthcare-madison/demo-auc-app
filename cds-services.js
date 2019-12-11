// BONUS: run this hosted in glitch.com
const auc = require('./auc.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const port = process.env.PORT || '3003';
const launchUrl = 'http://localhost:8899/launch.html';

app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.listen(port);

const cardDetails = {
  'appropriate': {
    detail: 'This order meets AUC guidelines.',
    icon: 'https://lh3.googleusercontent.com/bYNztCIytfV24Hzu9O11XcMhcHdcjRbX0TX2JfxX_LN-tKOOvqQi1lAhmBv7hY8UbMBmshW9vq3jFMO5kbCbq4fTsSWmlccsknxRvtGNunP_IktjIAn38prInj-6f6qWcTk3A9C3kkkJIilgeWOeOy3j8rifvViasCyhm5AGxeBs0TwyLIS-rV7LJDEWI9PjhTPcalYmvZBpl5Yti073BFHlBdMQH98D4CLQle9ZOR8zvXs43NGQdDFRk6QYplv7WFy6veT8b_sGeGxssvPVQoL9Kzcdagd1ftrvsY9vEzm9U79x4u9sBH_kw-BjyJilBh3ZLcTISbuSN-zT3Xn77uOh-aIemSKnr7jl33Ex3i0JyqxMcmj1Wc7cH4sCEHJ7bku3yZYndzVZgjvyPOV44EWo5OyDNVdQ22Hv4LbbSGQku0NCiSbm8g17rb3agKRnjmgioe6kWpa4lH16Q80FuRmAyYZ0GbBJl407qRrmMN-oO9R_LnzIABoV8BPyfU4BvsTDO_GZMBlaoy2K1Qv-0RL9faAjpN6iNQdofpJ28qn07MjJM-vHqPyD3U-eA8RgpSsofQscgE57GrSDDLRhgev3iyhhu2XU4pHbvmd4UUf82a2W0_OYkOlkeiTXM_YdrrW7E2Zpp2pWoIhZJIgXAVuaIz4v6k6EREPeBUuYiAoJHNs-UNXg3cvz=s100-no',
    indicator: 'success',
  },
  'no-guidelines-apply': {
    detail: 'This order is not specified by AUC guidelines.',
    icon: 'https://lh3.googleusercontent.com/fLQElMed2CFqAHxwRlIe5gJoHp9PFyZUPEcjgdB2Jj2dL7tHKfg4potyo39gsQeP_6wQ7zkWXaMGR7KnfkDrW1ks0jYaHmMdFi-AUer53CQCkKBwkgIEtgRSlozLDqiqpTBMIGRfsj_6oYtruy8O1cFEI54xSjXGtC3l3HThdk93lOjwbxdmqshbkYvm1XYTNcJuBQBdYgIEJusjX_RDBTvJiAxQ0lBeYSHjGBE8JibvQjLboSqNwefLVbIZ24LUenGoub9Y8mhVlxUeQMQPYclnn5W5Nj509L0Oc65ZAvLhoqAJs_sI6gr7ViJqkgdGfRe2pAXbikX2vBvLRHMktcGD5J_YVYTst5vrvfnhfhE0P-kPSp4XLt4WrfP5OQe7lysg-EFyiK6F7REP7NmiPy8x8hf9O9GuUoPFqXwU4psdoXbuNpCsuPA6tfnU6QwC-vUvzOWJgF1bMpu8NimhqPrOgBAUAHh0eVh9p3_ix8OwKBZ70EX8a7E9mq67k0-rTtMoElwBkFNzArTsMd1xp6QboF0F-oV_Li7xje_7Fokn-nDbB72ULX9K-MVbSkZvhD7Y_hJwQPG6wWF4kHaX_zzZsdD5botGT2VMrF-wGklzRrh2bBS-jT12IAeBECGgO_XKOu3Ire3WQ0SUdYGpE5Ebs4KrWAOykznsL9OqfkVuD1SIwjKgR-A2=s100-no',
    indicator: 'warning'
  },
  'not-appropriate': {
    detail: 'This order does not meet AUC guidelines.',
    icon: 'https://lh3.googleusercontent.com/6f3-twVm-TIZr0IWsb4Yuiys58PkeV3RU89XSDjRtV2beBiKxsoSg4-7qNgzLkZZf-Vy-1OoG5pswPQSK8XRuW3lE56wQgkItirK-iBozZMoD5JvcOR6ZxusPjrvMOE-iwaOKYZxnk0qyoDu7W4WQfaTDaGXAL26OuV_VBIxL0SSXzONWCrk70ckTJPzGy7detQTWknOZJNLuLEv0N45q_EoOu6SLgUlf3woVe-zm0JMNV68JsXH5FIlRwidaplY19MnY40If0fGtQkvnrNS4lwZ9pnx_PK_wiTJhhnpfuNRvrhy_Bdphsy_CN0fMj2FfrwhOJl48jlg8IvIkMzDMlEZGthzryIhN2B-94Eq2oNZS9JaAixqLg2P06_HcaVWMi5x6slPMCal_sU78yuta5lNZdxS7XYw9xJWLjW8Mu_LPKoA6m0onGcYLnwYkdXLFvqdF4dWKYOx1uFvPAMOsucST4orXqVTFWFiEm39et-ZUVOArLm9yXh8i4zl5PKTs4sA7c4u8CLwLyW04Unkg59KnL0ZNKX0xRNm052pW_WhX2g48oKjPIqnQ6Zl1omgNgzIyHo2mvpIKstENpGJwsIqNO456kWEbgUmydTZn40d-VdG47d5Xg5R0jl-WGrK_FbG8u0DupeeCE9kRo2GTrqUuVZWOPZnHJqLnJRWsvEdybsWqC5_m8Fz=s100-no',
    indicator: 'critical',
  },
};

function getOrders(serviceRequest) {
  return serviceRequest.code.coding
    .map(order => order.code)
    .filter(x => x);
}

function getReasons(serviceRequest) {
  return serviceRequest.reasonCode
    .map(reason => reason.coding).flat()
    .map(coding => coding.code).flat();
}

app.post('/cds-services/demo-auc-app', function(request, response) {
  const draftOrder = request.body.context.draftOrders.entry[0];
  const serviceRequest = draftOrder.resource;
  const orders = getOrders(serviceRequest);
  const indications = getReasons(serviceRequest);

  if ([...orders, ...indications].length === 0) {
    response.json({cards: [], actions: []});
    return;
  }

  const rating = auc.evaluate(orders.slice().pop(), reasons);
  const card = cardDetails[rating];
  const label = 'Click to view the source presentation.';
  const sourceUrl = 'https://microsoft-healthcare-madison.github.io/demo-auc-app';
  const cards = [{
    summary: 'Demo AUC Guideline Consultation App',
    indicator: card.indicator,
    detail: card.detail,
    source: { label, url: sourceUrl, icon: card.icon },
    links: [{
      appContext: JSON.stringify({indications, orders, draftOrder}),
      label: 'Edit Order in Demo App',
      url: launchUrl,
      type: 'smart'
    }],
  }];
  response.json({ cards });
});

// Discovery endpoint.
app.get('/cds-services', function(request, response) {
  response.json({
    services: [{
      hook: 'order-select',
      title: 'Demo AUC Guidance Consultation - Click to Insert Evidence',
      description: 'Click to insert evidence of AUC guidance consultation.',
      id: 'demo-auc-app'
    }]
  })
});
