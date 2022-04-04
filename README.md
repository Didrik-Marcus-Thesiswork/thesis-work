# thesis-work
A repo for all source code for our thesis work comparing GraphQL paired with different databases


## mongodb

### import data

mongoimport --db test --collection {COLLECTION_NAME} \
       --authenticationDatabase admin --username {USER} --password {PW} \
       --drop --file ./insert_data/{FILENAME}.crud.json
