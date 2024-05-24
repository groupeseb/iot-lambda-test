# Iot lambda test

The goal of this test is to create a backend lambda that will be able to handle basic CRUD for an address book.

## Data storage

We will use a dynamodb table called `AddressBook` with the following structure : 

```json
{
  "id": 12354,
  "name": "DUPONT",
  "firstname": "Toto",
  "phone": "061234567890",
  "email": "tot.dupont@groupeseb.com",
  "birthDate": "1993-07-04"
}
```
The table has a single unique index on the `id` field.

Tips: 
* to get a list of all items from a table, you should use the "scan" command.
* dynamodb uses a custom json representation of objects. Therefore, any input/output to dynamodb must be formatted/parsed using the `marshall` and `unmarshall` functions provided by the sdk.  

## Example lambda

You can use the directory lambda-sample (clone it) as a base for your work, it contains the necessary structure to create a lambda.
It also contains an example of dynamodb call to get you started with the AWS sdk.

## Endpoints
### Get List
Create an endpoint that will return only a list of ids of all existing contacts in the database.

### Get details
Create an endpoint that will return a detailed representation of a requested contact.

### Create contact
Create an endpoint that will take a contact object as input body and insert it in database.

Please check that name and firstname are mandatory and must be present and non-empty before inserting the data.
Other fields are non-mandatory.

### Delete contact
Create an endpoint that will delete a requested contact.

### Update contact
Create an endpoint that will take a contact object as input body and update the requested contact in database.
