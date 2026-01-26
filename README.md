# n8n-nodes-tanss-api


This is an [n8n](https://n8n.io/) community node.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You only need to provide:

- `username`
- `password`
- optionally: `TOTP Secret Key` (for two-factor authentication)

or alternatively you can provide an already generated `TANSS API Token` (depending on the end points intended for use).

## Compatibility

Compatible with n8n@1.60.0 or later
Tested with TANSS API. Version: 10.10.0

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Tanss API documentation](https://api-doc.tanss.de/)

## Development

This project can be developed using a regular local Node.js setup.

Optionally, a dev container configuration is included to provide a ready-to-use development environment with the required Node.js version and basic editor tooling.

### Implementation Progress

Progress: **93 / 256 (1 not in API Docs; login not necessary)** (36%)

- [x] **tickets [6/6]**
  - [x] [POST] Creates a ticket in the database
  - [x] [GET] Gets a ticket by id
  - [x] [DEL] Deletes a ticket by id
  - [x] [PUT] Updates a ticket
  - [x] [GET] Gets a ticket history
  - [x] [POST] Creates a comment
  - [x] [PUT] Merge two Tickets (not in API Docs)

- [x] **ticket lists [10/10]**
  - [x] [GET] gets a list of own tickets (assigned to currently logged in employee)
  - [x] [GET] gets a list of general tickets (assigned to no employee)
  - [x] [GET] gets a list of company tickets
  - [x] [GET] gets a list of tickets of all technicians
  - [x] [GET] gets a list of repair tickets
  - [x] [GET] gets a list of not identified tickets
  - [x] [GET] gets a list of all projects
  - [x] [GET] gets a list of all tickets which are assigned to local ticket admins
  - [x] [GET] gets a list of all ticket which a technician has a role in
  - [x] [PUT] Get a (custom) ticket list

- [x] **ticket content [5/5]**
  - [x] [GET] Gets all ticket documents
  - [x] [GET] Gets a ticket document
  - [x] [GET] Gets all ticket images
  - [x] [GET] Gets a ticket image
  - [x] [POST] upload a document/image

- [x] **ticket states [4/4]**
  - [x] [GET] Gets a list of all ticket states
  - [x] [POST] Creates a ticket state
  - [x] [PUT] Updates a ticket state
  - [x] [DEL] Deletes a ticket state

- [x] **timestamp [15/15]**
  - [x] [GET] gets a list of timestamps from a given period
  - [x] [POST] writes a timestamp into the database
  - [x] [PUT] edits a single timestamp
  - [x] [PUT] writes the timstamps of a whole day into the database at once
  - [x] [GET] gets the timestamp infos for a given time period
  - [x] [GET] gets the timestamp infos for a given time period (with statistical values)
  - [x] [POST] does one or more "day closings" for the timestamp module
  - [x] [DEL] remove / undo one or more "day closings" for the timestamp module
  - [x] [GET] gets all infos about last dayclosings for employees
  - [x] [POST] created dayClosings to a given date
  - [x] [POST] sets the initial balance for this employee
  - [x] [GET] gets a list of all pause configs
  - [x] [POST] creates a pause config
  - [x] [PUT] updates a pause config
  - [x] [DEL] deletes a pause config

- [x] **calls [9/9]**
  - [x] [POST] Creates/imports a phone call into the database
  - [x] [PUT] Get a list of phone calls
  - [x] [GET] Get phone call by id
  - [x] [PUT] Update phone call
  - [x] [POST] identifies a phone call
  - [x] [GET] Get all employee assignments
  - [x] [POST] Creates a new employee assignment
  - [x] [DEL] Deletes an employee assignment
  - [x] [POST] Creates a call notification

- [x] **calls (user context) [3/3]**
  - [x] [PUT] Get a list of phone calls
  - [x] [GET] Get phone call by id
  - [x] [POST] identifies a phone call

- [x] **remote supports [11/11]**
  - [x] [POST] Creates/imports a remote support into the database
  - [x] [PUT] Get list of remote supports
  - [x] [GET] Get remote support by id
  - [x] [PUT] Updates a remote support
  - [x] [DEL] Delete remote support
  - [x] [GET] Gets all device assignments
  - [x] [POST] Creates a device assignment
  - [x] [DEL] Deletes a device assignment
  - [x] [GET] Gets all technician assignments
  - [x] [POST] Creates a technician assignment
  - [x] [DEL] Delets a technician assignment

- [ ] **monitoring [0/7]**
  - [ ] [POST] Creates a ticket, using the monitoring api
  - [ ] [POST] Assigns a groupName to a company or device
  - [ ] [DEL] Delete a group assignment
  - [ ] [GET] Gets all group assignments
  - [ ] [GET] Gets ticket(s), based on a given group
  - [ ] [GET] Gets a ticket (created by the monitoring api) by id
  - [ ] [PUT] Updates a ticket (created by the monitoring api) by id

- [ ] **erp [0/16]**
  - [ ] [POST] Insert new invoices
  - [ ] [GET] Gets a list of billable supports
  - [ ] [GET] Get a list of customers and employees
  - [ ] [POST] Insert new customers
  - [ ] [POST] create a new ticket
  - [ ] [GET] gets a list of tickets states
  - [ ] [GET] gets a list of tickets types
  - [ ] [POST] upload a document/image into a ticket
  - [ ] [GET] get all employees from the own company
  - [ ] [GET] gets all departments
  - [ ] [GET] list of company categories
  - [ ] [POST] Creates a new company category
  - [ ] [GET] gets all employees of a department
  - [ ] [GET] search for a company
  - [ ] [GET] gets all departments of a employee
  - [ ] [GET] gets all users with the associated departments

- [ ] **chats [0/10]**
  - [ ] [POST] Creates a new chat
  - [ ] [PUT] Get a list of chats
  - [ ] [GET] Gets a chat
  - [ ] [GET] Gets chat close requests
  - [ ] [POST] Creates a new chat message
  - [ ] [POST] Adds a participant
  - [ ] [DEL] Deletes a participant
  - [ ] [POST] Closes a chat
  - [ ] [PUT] Accept/decline close request
  - [ ] [POST] re-opens a chat

- [ ] **offer [0/16]**
  - [ ] [POST] Creates a new erp selection
  - [ ] [GET] Fetches an erp selection
  - [ ] [PUT] Updates an erp selection
  - [ ] [DEL] Deletes an erp selection
  - [ ] [GET] Gets list of offer templates
  - [ ] [POST] Creates an offer template
  - [ ] [GET] Gets an offer templates
  - [ ] [PUT] Updates an offer templates
  - [ ] [DEL] Deletes an offer template
  - [ ] [GET] material picker
  - [ ] [GET] material picker for erp selection
  - [ ] [PUT] Gets list of offers
  - [ ] [POST] Creates an offer
  - [ ] [GET] Gets an offer
  - [ ] [PUT] Updates an offer
  - [ ] [DEL] Deletes an offer

- [x] **availability [1/1]**
  - [x] [GET] Fetches availability infos

- [x] **employees [2/2]**
  - [x] [GET] Gets all technicians
  - [x] [POST] creates an employee

- [x] **mails [1/1]**
  - [x] [POST] Test email smtp settings

- [ ] **tags [0/10]**
  - [ ] [POST] Creates a new tag
  - [ ] [GET] Get all tags
  - [ ] [GET] Gets a tag
  - [ ] [PUT] Edits a tag
  - [ ] [DEL] Deletes a tag
  - [ ] [POST] Assigns a tag
  - [ ] [DEL] Removes a tag
  - [ ] [GET] List of tags to an assignment
  - [ ] [PUT] Assigns multiple tags
  - [ ] [GET] List of tags logs to an assignment

- [ ] **callback [0/4]**
  - [ ] [POST] Creates a callback
  - [ ] [PUT] Get a list of callbacks
  - [ ] [GET] Gets a callback
  - [ ] [PUT] Updates a callback

- [ ] **search [0/1]**
  - [ ] [PUT] global search

- [ ] **checklist [0/5]**
  - [ ] [POST] Assigns a checklist to a ticket
  - [ ] [DEL] Removes a checklist from a ticket
  - [ ] [GET] Gets checklists for a ticket
  - [ ] [GET] Gets checklist for ticket
  - [ ] [PUT] Check an item

- [ ] **supports [0/5]**
  - [ ] [PUT] Get a support list
  - [ ] [POST] Creates a support/appointment
  - [ ] [GET] Gets a support/appointment
  - [ ] [PUT] Edits a support/appointment
  - [ ] [POST] Uploads a signature for supports

- [ ] **timers [0/8]**
  - [ ] [GET] Get all timers of current user
  - [ ] [POST] Creates a timer
  - [ ] [DEL] Deletes a timer
  - [ ] [GET] Get a specific timer
  - [ ] [PUT] Starts/stops timer
  - [ ] [GET] Get all timer fragments
  - [ ] [DEL] Deletes a timer fragment
  - [ ] [PUT] Updates a timer fragment

- [x] **pc [5/5]**
  - [x] [GET] Gets a pc by id
  - [x] [PUT] Updates a pc
  - [x] [DEL] Deletes a pc
  - [x] [POST] Creates a pc
  - [x] [PUT] Gets a list of pcs

- [ ] **periphery [0/11]**
  - [ ] [GET] Gets a periphery by id
  - [ ] [PUT] Updates a periphery
  - [ ] [DEL] Deletes a periphery
  - [ ] [POST] Creates a periphery
  - [ ] [PUT] Gets a list of peripheries
  - [ ] [GET] Get periphery types
  - [ ] [POST] Create periphery type
  - [ ] [PUT] Update periphery type
  - [ ] [DEL] Delete periphery type
  - [ ] [POST] Assign periphery
  - [ ] [DEL] Delete periphery assignment

- [ ] **components [0/9]**
  - [ ] [GET] Gets a component by id
  - [ ] [PUT] Updates a component
  - [ ] [DEL] Deletes a component
  - [ ] [POST] Creates a component
  - [ ] [PUT] Gets a list of components
  - [ ] [GET] Gets a list of component types
  - [ ] [POST] Create component type
  - [ ] [PUT] Update component type
  - [ ] [DEL] Delete component type

- [ ] **services [0/5]**
  - [ ] [POST] Creates a service
  - [ ] [GET] Gets a list of all services
  - [ ] [GET] Gets a service by id
  - [ ] [PUT] Updates a service
  - [ ] [DEL] Deletes a service

- [x] **ip [0/4]**
  - [x] [GET] Gets ip addresses
  - [x] [POST] Creates an ip address
  - [x] [PUT] Update ip address
  - [x] [DEL] Deletes an ip address

- [ ] **company [0/2]**
  - [ ] [POST] Creates a new company
  - [ ] [GET] Gets all employees of a company

- [ ] **company category [0/10]**
  - [ ] [GET] list of categories
  - [ ] [POST] Creates a new company category
  - [ ] [GET] gets a category
  - [ ] [PUT] updates a category
  - [ ] [DEL] Deletes a company category
  - [ ] [GET] list of company types
  - [ ] [POST] Creates a new company type
  - [ ] [GET] gets a company type
  - [ ] [PUT] updates a company type
  - [ ] [DEL] Deletes a company type

- [ ] **documents [0/6]**
  - [ ] [PUT] Get a list of company documents
  - [ ] [POST] Creates a document
  - [ ] [GET] Get a single document (including content)
  - [ ] [PUT] Updates a document
  - [ ] [DEL] Deletes a document
  - [ ] [POST] Uploads a file

- [ ] **webHooks [0/6]**
  - [ ] [POST] creates a rule
  - [ ] [PUT] get a list of rules
  - [ ] [PUT] updates a rule
  - [ ] [GET] gets a rule
  - [ ] [DEL] deletes a rule
  - [ ] [PUT] test a rule

- [ ] **ticket board [0/10]**
  - [ ] [GET] Gets the ticket board with all panels
  - [ ] [GET] Gets an empty ticket board panel
  - [ ] [POST] Creates a new ticket board panel
  - [ ] [PUT] Updates a ticket board panel
  - [ ] [GET] Gets a ticket board panel
  - [ ] [DEL] Deletes a ticket board panel
  - [ ] [GET] Gets all registers from a ticket board panel
  - [ ] [GET] Gets a ticket board from a project
  - [ ] [GET] Gets all registers from a ticket board project
  - [ ] [GET] Get global ticket panels

- [x] **operating systems [5/5]**
  - [x] [POST] Creates a new os
  - [x] [GET] Get a list of all os
  - [x] [PUT] Updates a os
  - [x] [GET] Get a specific os
  - [x] [DEL] Deletes a specific os

- [x] **manufacturer [5/5]**
  - [x] [POST] Creates a new manufacturer
  - [x] [GET] Get a list of all manufacturers
  - [x] [PUT] Updates a manufacturer
  - [x] [GET] Get a manufacturer
  - [x] [DEL] Deletes a manufacturer

- [x] **cpus [5/5]**
  - [x] [POST] Creates a new cpu
  - [x] [GET] Get a list of all cpus
  - [x] [PUT] Updates a cpu
  - [x] [GET] Get a cpu
  - [x] [DEL] Deletes a cpu

- [x] **hddTypes [5/5]**
  - [x] [POST] Creates a new hdd type
  - [x] [GET] Get a list of all hdd types
  - [x] [PUT] Updates a hdd type
  - [x] [GET] Get a hdd type
  - [x] [DEL] Deletes a hdd type

- [ ] **identify [0/1]**
  - [ ] [POST] identifies items

- [ ] **emailAccounts [0/6]**
  - [ ] [POST] Creates an email account
  - [ ] [GET] List accounts of company
  - [ ] [GET] Gets an account
  - [ ] [PUT] Edit an accounts
  - [ ] [DEL] Deletes an account
  - [ ] [GET] List account types

- [ ] **vacationRequests [0/7]**
  - [ ] [PUT] Gets a list of vacation requests
  - [ ] [GET] Gets a list of absence/custom types
  - [ ] [POST] creates a vacation request
  - [ ] [PUT] updates a vacation request
  - [ ] [DEL] deletes a vacation request
  - [ ] [GET] gets the available vacation days per year
  - [ ] [POST] sets the available vacation days per year

- [ ] **activityFeed [0/3]**
  - [ ] [PUT] List of user items
  - [ ] [GET] Number of unseen events
  - [ ] [POST] Marks all as seen
