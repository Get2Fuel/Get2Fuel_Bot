# get2fuel_bot

## Description

This is a service for a Telegram Bot that consumes [Osservaprezzi-Carburanti](https://carburanti.mise.gov.it/OssPrezziSearch/) APIs through [OsservaPrezzi-Connector](https://github.com/Get2Fuel/osservaprezzi-connector)

At the moment this bot just sends you the pumps around you, sorted by price based on your location.

## Commits history

### 2022-04-27

#### Switched to MVC

- implemented MVC pattern
- changed all messages to HTML render instead of MD
- added preset favorites for testing purposes
- updated README.md

### 2022-04-26

#### New interface

- new interface for responses
- minor changes
- updated README.md

### 2022-04-01

#### Back online

- implemented new API
- minor changes
- updated README.md

### 2022-02-19

#### Nicer look

- added i18n support
- added menu entries
- added module for keyboards
- added routing base
- messageHandler module renamed to pumpsFetcher (makes more sense)
- minor changes
- updated README.md

### 2021-12-03

#### Framework changed

- changed framework for better support
- added menu
- creadet messageHandler module
- updated README.md

### 2021-12-02

#### Date check

- implemented a date check to exclude outdated prices (older than 72 hours)
- now the response shows both gasoline and petrol prices
- updated README.md

### 2021-12-01

#### Bugfixing

- bugfixing
- updated README.md

### 2021-12-01

#### Barely functional

- minimum code required to work
- updated README.md

### 2021-11-30

#### Initial commit
