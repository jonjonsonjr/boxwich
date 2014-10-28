/* Set all headers to what my browser was using and enable cookies. */
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
var config = require('config');
var email = config.get('email');
var pass = config.get('pass');
var address = config.get('address');
var base_url = "https://online.jimmyjohns.com";

/**
 * The chain of HTTP requests required to initiate a Jimmy John's order.
 *
 * GET "/":
 *    Hit the home page to grab cookies and stuff.
 *
 * POST "/api/Customer/Login":
 *    Log in.
 *
 * POST "/API/Location/ForDeliveryAddress":
 *    Find the nearest store to our address.
 *
 * POST "/api/Order":
 *    Create a delivery order at the nearest store.
 *
 * PUT "/api/Order/DeliveryAddress":
 *    Set the delivery address to our address.
 *
 * GET "/api/Menu":
 *    Grab the entire menu.
 *
 * GET "/api/Menu/Item?id=$id":
 *    Pick a random sandwich on the menu from the slims.
 *    This pulls down all the properties and options available.
 *
 * POST "/api/Order/Items":
 *    Leave everything as default. We can map the ModifierGroups from the
 *    reponse into the Modifiers field required for the request.
 *    Add the sandwich to our order.
 *
 * POST "/api/Payment/Payment":
 *    Set the payment method to cash on delivery.
 *
 * GET "/api/Order/Submit":
 *    Submit the order.
 */
var requests = [
  {
    "url": "/",
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
    "callback": function () {
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
].map(function (req) {
  req.url = base_url + req.url;
  return req;
});

executeRequests(requests);

/**
 * Recursively execute each request, passing the previous response into its
 * callback so it can grab anything it needs and format the request body
 * correctly.
 */
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
      params.qs = payload; // add to query string since GET has no body
    } else {
      params.json = payload;
    }
  }

  /* Send the request */
  request(params, function (err, response, body) {
    if (err) {
      console.log(err);
      return;
    }

    log(body);

    executeRequests(requests, body); // do the rest
  });
}

/**
 * Log nicely formatted JSON. This is really hacky.
 *
 * Assume it's already stringified, if that throws an error,
 * just stringify it.
 */
function log(json) {
  try {
    console.log(JSON.stringify(JSON.parse(json), null, 4));
  } catch (e) {
    console.log(JSON.stringify(json, null, 4));
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
