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

var email = process.env.email;
var pass = process.env.pass;

var reqs = [
  {
    "url": "/api/Customer/Login",
    "method": "POST",
    "body": {
      "Email": email,
      "Password": pass,
      "RememberMe": false
    }
  },{
    "url": "/api/Order/DeliveryAddress",
    "method": "PUT"
  },{
    "url": "/api/Order",
    "method": "POST"
  },{
    "url": "/api/Menu",
    "method": "GET"
  },{
    "url": "/api/Menu/Item/",
    "method": "GET"
  },{
    "url": "/api/Order/Items",
    "method": "POST"
  },{
    "url": "/api/Order/",
    "method": "GET"
  },{
    "url": "/api/Payment/PaymentTypes",
    "method": "GET"
  },{
    "url": "/api/Payment/Tip",
    "method": "PUT"
  },{
    "url": "/api/Payment/Payment",
    "method": "POST"
  },{
    "url": "/api/Order/Submit",
    "method": "GET"
  },{
    "url": "/API/Location/ForDeliveryAddress",
    "method": "POST"
  },{
    "url": "/API/Location/",
    "method": "GET"
  }
].map(function (u) {
  u.url = "https://online.jimmyjohns.com" + u.url;
  return u;
});

reqs.forEach(function (req) {
  console.log(req.method + ' ' + req.url);
});
