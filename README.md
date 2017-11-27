# Pandora Dashboard

A local Dashboard for the Pandora.js. 

The Dashboard it is a standard Pandora.js Project, manage like a normal Project.

## Usage

```bash
npm i pandora-dashboard -g
pandora start --npm pandora-dashboard
```

open `http://127.0.0.1:9081`

## Custom TCP Port and IP Address

By default, The Dashboard listens to `http://127.0.0.1:9081`. But it also can tell The Dashboard a specific TCP Port and a specific IP Address to listen on.

```bash
pandora start --npm pandora-dashboard --env "DASHBORAD_PORT=9081 DASHBOARD_IP=0.0.0.0"
```
