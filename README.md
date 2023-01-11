# Introduction

I implemented this rate limit middleware by Time bucket algorithm.

# Config

To config rate limit for different route you need to go to `src/utility/config.js` and fill the rateLimitRules Object

```
const rateLimitRules = {
  '/secure': {
    thresholds: [
      {
        limit: TOKEN_ENDPOINT_LIMIT,
        action: [console.log],
        window: TOKEN_ENDPOINT_LIMIT_WINDOW,
      },
    ],
  },
  '/': {
    thresholds: [
      {
        limit: IP_ENDPOINT_LIMIT,
        action: [console.log],
        window: IP_ENDPOINT_LIMIT_WINDOW,
      },
    ],
  },
}
```

You can set different rule for different path and you can set multiple rule for each path.

# How to run

```
npm install .
npm run start
```

then you can send request to your localhost and port 3000 over two path `/` and `/secure`.
TO access to secure path you need to add `auth-code` inside your http header.
You can find auth-code example in `src/utility/constant`.(They are JWT token and you can find secret key inside the same file then you can generate your own JWT token with jwt.io)

# Unit Tests

You can run unit tests by following command:

```
npm run test
```

# Stress Test

You can find an Apache Jmeter config file inside `/jmeter` folder, you can use it to regenerate stress test. Also, you can find stress test result for 10 User with 100 loop in the following:
Samples: 2000
Average: 50
Min: 4
Max: 150
Std. Dev.: 28.73573896300563
Error: 0.6985
Throughput: 151.44631228229593

# Code Coverage

You can run code coverage command by running following command:

```
npm run coverage
```

You can find the code coverage result in the following

```
 PASS  tests/middlewares/auth.test.js
 PASS  tests/utility/rateLimitter.test.js
------------------|---------|----------|---------|---------|-------------------
File              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------------|---------|----------|---------|---------|-------------------
All files         |   85.45 |    63.63 |     100 |   85.18 |
 middlewares      |   93.75 |      100 |     100 |   93.33 |
  authenticate.js |   93.75 |      100 |     100 |   93.33 | 23
 utility          |   82.05 |    55.55 |     100 |   82.05 |
  constant.js     |     100 |       50 |     100 |     100 | 1-15
  rateLimitter.js |   78.12 |       60 |     100 |   78.12 | 17,28-36
------------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        3.206 s
```
