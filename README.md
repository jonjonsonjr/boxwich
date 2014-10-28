# boxwich

Sandwiches delivered with the push of a button.

![The box](http://jonjonsonjr.github.io/boxwich/img/gh_box.jpg)

## Background

This program was part of our project at [HackNC 2014](http://hacknc.us/),
the boxwich. It won 3rd place overall as well as the sponsor's choice awards from
[Mailjet](https://www.mailjet.com/) and
[Digital Ocean](https://www.digitalocean.com/).

We wanted to make something that solved a serious problem: deciding what to eat.
With the boxwich, you don't have to worry about where to go or what to order,
you just have to press the button! The boxwich will randomly select a sandwich
from Jimmy John's and have it delivered to you!

The switch acts as a safety mechanism, so you have to flip it to arm the box
before it will work. We had several people just come up and immediately push
the button during HackNC, so it was very useful -- it saved me a lot of money.

The boxwich currently only selects from the Plain Slims because they're much
cheaper, but that is trivial to change.

## Usage

Edit the config file to add your Jimmy John's account credentials, your
address, and your phone number. You have to put your phone number in the
delivery instructions due to a bug.

To order a sandwich, just run the program.

	$ node app.js

If you're feeling cheeky, run the binary.

	$ make me a sandwich

The payment method is set to cash, so don't accidentally run this without cash!

## Hardware

We used a [Raspberry Pi](https://github.com/gabrieltriggs/boxwich) to connect
the box to the internet.

## Acknowledgements

This project was inspired by [makemeasandwich](https://github.com/travist/makemeasandwich.js).
I wanted to just use this originally, but I couldn't get it to work, so I rewrote it from scratch.

- [Gabriel Triggs](https://github.com/gabrieltriggs) built the box and wrote the button daemon.
- [Taylor King](https://github.com/tking0036) was our pocket linux expert and constant entertainment.
