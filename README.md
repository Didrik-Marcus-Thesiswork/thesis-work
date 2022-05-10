# thesis-work
A repo for all source code for our thesis work comparing GraphQL paired with different databases

## setup

Change the ip value in /graphql-bench/bench.yaml to your local ip (ex. 192.168.x.x)

Start the server by going into in /application folder and run: `docker-compose build && docker-compose up` 

Insert fake data by going into /faker folder and run: `npm run main`.

Start the benchmark by running the following script in /graphql-bench folder:

```bash
   cat bench.yaml | docker run -i --rm -p 8050:8050 -v $(pwd)/queries.graphql:/graphql-bench/ws/queries.graphql hasura/graphql-bench:v0.3.1
```

Once the tests are completed the results will be avaliable at [http://0.0.0.0:8050/](http://0.0.0.0:8050/)
