var config = require('config');
/*
 * Set all headers to what my browser was using and enable cookies.
 */
var request = require('request').defaults({
  "jar": true,
  "headers": {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36",
    "Referrer": "https://online.jimmyjohns.com/",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    "Accept-Encoding": "gzip,deflate",
    "Accept-Language": "en-US,en;q=0.8,it;q=0.6"
  }
});

var email = config.get('email');
var pass = config.get('pass');
var address = config.get('address');
var token = config.get('ACCESS_TOKEN');
var base_url = "https://online.jimmyjohns.com";

var requests = [
  {
    "url": "/", // I think this sets cookies/tokens for us.
    "method": "GET"
  },{
    "url": "/api/Customer/Login",
    "method": "POST",
    "callback": function () {
      return {
        "Email": email,
        "Password": pass,
        "RememberMe": false
      };
    }
  },{
    "url": "/API/Location/ForDeliveryAddress",
    "method": "POST",
    "callback": function () {
      return address;
    }
  },{
    "url": "/api/Order",
    "method": "POST",
    "callback": function (response) {
      return {
        "LocationId": response.Locations[0].Id,
        "OrderType": "Delivery",
        "ScheduleTime": "ASAP"
      };
    }
  },{
    "url": "/api/Order/DeliveryAddress",
    "method": "PUT",
    "callback": function (response) {
      return address;
    }
  },{
    "url": "/api/Menu",
    "method": "GET"
  },{
    "url": "/api/Menu/Item/",
    "method": "GET",
    "callback": function (response) {
      var menus = JSON.parse(response).Menus;
      var sections = menus[0].Sections;
      var slims = sections[0].MenuItems;
      var index = getRandomInt(0, slims.length);
      var id = slims[index].Id;

      return {
        "id": id
      };
    }
  },{
    "url": "/api/Order/Items",
    "method": "POST",
    "callback": function (response) {
      var item = JSON.parse(response).MenuItem;
      var groups = item.ModifierGroups.map(function (g) {
        return {
          "GroupId": g.Id,
          "SelectedAnswerId": g.SelectedAnswer,
          "SelectedAnswerText": "",
          "EditItem": false
        };
      });
      return [{
        "Index": "",
        "MenuItemId": item.Id,
        "MenuItemText": item.Name,
        "SelectedSize": item.DefaultSize,
        "Quantity": 1,
        "ExtendedPrice": 0,
        "Label": "",
        "DisplayText": "",
        "DisplayPrice": "",
        "FavoriteName": "",
        "ItemCost": 0,
        "MustEdit": false,
        "IsQuantityFixed": false,
        "IsSizeFixed": false,
        "IsPriceFixed": false,
        "CanDelete": false,
        "CanEdit": false,
        "IsMainCouponItem": false,
        "NoMayo": false,
        "RewardNotes": "",
        "CouponReference": "",
        "ConfirmedSprouts": false,
        "Modifiers": groups
      }];
    }
  },{
    "url": "/api/Payment/Payment",
    "method": "POST",
    "callback": function (response) {
      var amount = response.Order.Total;
      return {
        "PaymentCode": "CASH",
        "Amount": amount
      };
    }
  },{
    "url": "/api/Order/Submit",
    "method": "GET"
  }
].map(function (u) {
  u.url = base_url + u.url;
  return u;
});

executeRequests(requests);

function executeRequests(requests, previous_response) {
  if (!requests || requests.length === 0) {
    return; // done
  }

  var req = requests.shift();
  log(req);

  var params = {
    "method": req.method,
    "url": req.url
  };

  if (typeof req.callback === "function") {
    var payload = req.callback(previous_response);
    log(payload);

    if (req.method === "GET") {
      params.qs = payload;
    } else {
      params.json = payload;
    }
  }

  request(params, function (err, response, body) {
    if (err) {
      console.log(err);
      return;
    }

    log(body);

    executeRequests(requests, body);
  });
}

function log(json) {
  try {
    JSON.parse(json);
  } catch (e) {
    console.log(JSON.stringify(json, null, 4));
    return false;
  }

  console.log(JSON.stringify(JSON.parse(json), null, 4));
  return true;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
