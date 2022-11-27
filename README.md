# rad-tunes

Rad Tunes is an HTTP API that contains one endpoint that allows a user to filter music artists based on a certain music genre. Users can enter query parameters to specify whether they want to include or exclude a music artist based on genre. Additionally, users can specify the exact genre or whether the genre contains certain key words or letters. 

## Prerequisites

node `16.14.0`
npm `7.19.0`

If you do not have these, then install node here https://nodejs.org/en/ (npm is included at the installation of node)

## How To Run Project

1. Clone the repository. Open your terminal and run `git clone https://github.com/lanxdrey19/rad-tunes.git`
2. Then run `cd rad-tunes`
3. Then run `npm install`
3. Then run `npm start`

### Example Queries

Open Google Chrome and enter these into the browser

Include punk artists only
`http://localhost:3000/search?include=punk`

Exclude punk artists
`http://localhost:3000/search?exclude=punk`

Include artists from genres that have `pun` in it
`http://localhost:3000/search?has=pun`

Exclude artists from genres that have `pun` in it
`http://localhost:3000/search?hasnot=pun`

Include artists from the punk and jazz genres
`http://localhost:3000/search?include=punk&includes=jazz`

Excludes artists from the punk and jazz genres
`http://localhost:3000/search?exclude=punk&excludes=jazz`

Include artists from the jazz genre and those genres that contain the letter p
`http://localhost:3000/search?include=jazz&has=p`

Exclude artists from the punk genre and those genres that contain the letter p
`http://localhost:3000/search?exclude=jazz&has=p`

Note that for a query, the user can only make only inclusion related or only exclusion related queries. For example, a query with both the include and exclude term is not valid. Likewise with a query with both the has and hasnot term. 

## Assumptions Made
- Users would like the freedom to make inclusion-related and exclusion-related queries. Hence, this is the reason why the valid query terms include: includes, excludes, has, and hasnot
- Any error that occurs that is not related to the users entering invalid queries will be hidden (i.e. return a 500 a server error). While it might not be directly an error with the server, it is to hide implementation details which can be sensitive. The assumption is that this endpoint will be used by a client and implementation details should not be revealed. The client is most likely a front-end application. 
- Minimal implementation is needed on the client, i.e. the front-end application, to support the filtering of artists via a music genre. Hence, it is expected that most of the implemntation and validation is done in the Rad Tunes API. Hence, this is the reason why the Rad Tunes API throws a few 400 errors if the endpoint called is not valid. 
- A list of valid artists and their respective genres will be returned. It is up to the client to decide how they will use/format the information they requested. Also, since artists of more than one genres can be returned, this information needs to be retained. 
