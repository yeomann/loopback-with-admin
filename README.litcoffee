# loopback-with-domain

run loopback server with "domain"

domain is in this context business logic, the same as Domain-Driven Design (DDD).

connection with [base-domain](https://github.com/CureApp/base-domain)


# install

```
npm install loopback-with-domain
```


# run

    lbWithDomain = require 'loopback-with-domain'

    domain = require('base-domain').createInstance(dirname: 'domain')

    config =
        server:
            port: 4000

    lbWithDomain.runWithDomain(domain, config).then ->
        # loopback started


# configs

## server

 config name | meaning       | default
-------------|---------------|----------------
 restApiRoot | REST api root | /api
 port        | port number   | 3000

## admin

 config name | meaning               | default
-------------|-----------------------|----------------------------
 accessToken | accessToken for admin | (you must set access token)


