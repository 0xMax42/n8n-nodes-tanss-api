**Status / Progress**  
Progress: **30 / 256** (-%)

`[====================]`

## To-Do / Progress

<details>
<summary><strong>security [0/1] - Working</strong></summary>

  - [x] Login with Username & Password → Working  
  - [ ] 2FA Auth Support  
</details>
<details>
<summary><strong>tickets [6/6] - Done</strong></summary>

  - [x] [POST] Creates a ticket in the database
  - [x] [GET] Gets a ticket by id
  - [x] [DEL] Deletes a ticket by id
  - [x] [PUT] Updates a ticket
  - [x] [GET] Gets a ticket history
  - [x] [POST] Creates a comment
</details>
<details>
<summary><strong>ticket lists [10/10] - Done</strong></summary>

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
</details>
<details>
<summary><strong>ticket content [5/5] - Done</strong></summary>

  - [x] [GET] Gets all ticket documents
  - [x] [GET] Gets a ticket document
  - [x] [GET] Gets all ticket images
  - [x] [GET] Gets a ticket image
  - [x] [POST] upload a document/image
</details>
<details>
<summary><strong>ticket states [4/5] - Working</strong></summary>

  - [x] [GET] Gets a list of all ticket states
  - [x] [POST] Creates a ticket state
  - [x] [GET] Gets a single ticket state - Not Working
  - [x] [PUT] Updates a ticket state
  - [x] [DEL] Deletes a ticket state
</details>
<details>
<summary><strong>timestamp [0/15] - Development</strong></summary>

  - [ ] [GET] gets a list of timestamps from a given period
  - [ ] [POST] writes a timestamp into the database
  - [ ] [PUT] edits a single timestamp
  - [ ] [PUT] writes the timstamps of a whole day into the database at once
  - [ ] [GET] gets the timestamp infos for a given time period
  - [ ] [GET] gets the timestamp infos for a given time period (with statistical values)
  - [ ] [POST] does one or more "day closings" for the timestamp module
  - [ ] [DEL] remove / undo one or more "day closings" for the timestamp module
  - [ ] [GET] gets all infos about last dayclosings for employees
  - [ ] [POST] created dayClosings to a given date
  - [ ] [POST] sets the initial balance for this employee
  - [ ] [GET] gets a list of all pause configs
  - [ ] [POST] creates a pause config
  - [ ] [PUT] updates a pause config
  - [ ] [DEL] deletes a pause config
</details>
<details>
<summary><strong>calls [0/9] - Development</strong></summary>

  - [ ] [POST] Creates/imports a phone call into the database
  - [ ] [PUT] Get a list of phone calls
  - [ ] [GET] Get phone call by id
  - [ ] [PUT] Update phone call
  - [ ] [POST] identifies a phone call
  - [ ] [GET] Get all employee assignments
  - [ ] [POST] Creates a new employee assignment
  - [ ] [DEL] Deletes an employee assignment
  - [ ] [POST] Creates a call notification
</details>
<details>
<summary><strong>calls (user context) [3/3] - Done</strong></summary>

  - [x] [PUT] Get a list of phone calls
  - [x] [GET] Get phone call by id
  - [x] [POST] identifies a phone call
</details>
<details>
<summary><strong>remote supports [11] - ToDo</strong></summary>

  - [ ] [POST] Creates/imports a remote support into the database
  - [ ] [PUT] Get list of remote supports
  - [ ] [GET] Get remote support by id
  - [ ] [PUT] Updates a remote support
  - [ ] [DEL] Delete remote support
  - [ ] [GET] Gets all device assignments
  - [ ] [POST] Creates a device assignment
  - [ ] [DEL] Deletes a device assignment
  - [ ] [GET] Gets all technician assignments
  - [ ] [POST] Creates a technician assignment
  - [ ] [DEL] Delets a technician assignment
</details>


# n8n-nodes-tanss


This is an n8n community node. It lets you use the TANSS API in your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

nothing here

## Credentials

nothing here

## Compatibility

Compatible with n8n@1.60.0 or later

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
