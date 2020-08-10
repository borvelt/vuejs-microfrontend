# Micro Front-End (Vuejs)
__This Repo has been provided for test and experimental purposes so needs more considerations for Production__

### Intro
First of all please read [my Medium.com article](https://medium.com/@borvelt/micro-frontend-vue-js-435d9458218c) generally about Micro Front-Ends also describes this repo in detail.

Please be informed that the ideal is that every subdirectory in this repo (`container`, `vehicles`, `vendors`) maintain or develop separately and we won't have a mono repo or something like that.

After my recent commits, I've changed the `common` directory to `vendors`, and to makes consistency, port numbers have been changed.

	container(entrypoint): 8000

	vendors: 8001

	vehicles(app): 8002



#### Vendors
vendors app carries out our application common scripts like `axios`, `Vue`, `React`, or any other common libraries between apps.

#### Container
Entrypoint of application is here. The Container is a conjunction for other apps and has a magic file `frame.js` which will pull and up relative apps.

#### Vehicles
`vehicles` is a simple app with lazy loading. applications development should be start from here, apps will build separately and they will be joined together by Container application.

### Dockerize 
applications have been dockerized and you can build and up with `docker-compose` or whatever you preferred.

```bash
$ docker-compose up
```
