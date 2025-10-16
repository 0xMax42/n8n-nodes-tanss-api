**Status / Progress**  
Progress: **54 / 256** (-%)

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
<summary><strong>timestamp [15/15] - Testing</strong></summary>

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
</details>
<details>
<summary><strong>calls [9/9] - Testing</strong></summary>

  - [x] [POST] Creates/imports a phone call into the database
  - [x] [PUT] Get a list of phone calls
  - [x] [GET] Get phone call by id
  - [x] [PUT] Update phone call
  - [x] [POST] identifies a phone call
  - [x] [GET] Get all employee assignments
  - [x] [POST] Creates a new employee assignment
  - [x] [DEL] Deletes an employee assignment
  - [x] [POST] Creates a call notification
</details>
<details>
<summary><strong>calls (user context) [3/3] - Done</strong></summary>

  - [x] [PUT] Get a list of phone calls
  - [x] [GET] Get phone call by id
  - [x] [POST] identifies a phone call
</details>
<details>
<summary><strong>remote supports [0/11] - ToDo</strong></summary>

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
<summary><strong>monitoring [0/7] - ToDo</strong></summary>

  - [ ] [POST] Creates a ticket, using the monitoring api
  - [ ] [POST] Assigns a groupName to a company or device
  - [ ] [DEL] Delete a group assignment
  - [ ] [GET] Gets all group assignments
  - [ ] [GET] Gets ticket(s), based on a given group
  - [ ] [GET] Gets a ticket (created by the monitoring api) by id
  - [ ] [PUT] Updates a ticket (created by the monitoring api) by id
</details>
<summary><strong>erp [0/16] - ?</strong></summary>

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
</details>
<summary><strong>chats [0/10] - ToDo</strong></summary>

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
</details>
<summary><strong>offer [0/16] - ?</strong></summary>

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
</details>
<summary><strong>availability [0/1] - ToDo</strong></summary>

  - [ ] [GET] Fetches availability infos
</details>
<summary><strong>employees [0/2] - ToDo</strong></summary>

  - [ ] [GET] Gets all technicians
  - [ ] [POST] creates an employee
</details>
<summary><strong>mails [0/1] - ToDo</strong></summary>

  - [ ] [POST] Test email smtp settings
</details>
<summary><strong>tags [0/10] - ToDo</strong></summary>

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
</details>
<summary><strong>callback [0/4] - ToDo</strong></summary>

  - [ ] [POST] Creates a callback
  - [ ] [PUT] Get a list of callbacks
  - [ ] [GET] Gets a callback
  - [ ] [PUT] Updates a callback
</details>
<summary><strong>search [0/1] - ToDo</strong></summary>

  - [ ] [PUT] global search
</details>
<summary><strong>checklists [0/5] - ToDo</strong></summary>

  - [ ] [POST] Assigns a checklist to a ticket
  - [ ] [DEL] Removes a checklist from a ticket
  - [ ] [GET] Gets checklists for a ticket
  - [ ] [GET] Gets checklist for ticket
  - [ ] [PUT] Check an item
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
