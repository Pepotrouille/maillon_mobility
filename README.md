# Maillon Mobility Web page
A small React web page for Maillon Mobility tricycle. The page is able to display control level of efforts for the vehicle depending on the vitals.

## What is Maillon Mobility
[Maillon Mobility](https://www.maillonmobility.com/) is a French company specializing in the conception of light-weighted electric vehicle. 
Their main product to be sold is Maillon Capitole, an electric tricycle created for peri-urban mobility.

## What is in this repository?
In this repository, you should be able to find two branches:

- Main: Contains the main React code for the web page.
- gh-pages: the built code for the deployment of the web page. This build can be accessed through the following link: 

## How to locally run the React application?
You can run locally a server to deploy the application by running the following commands in a console:  
To ensure that all packages are installed and up to date:

```npm i react-bluetooth```
```npm install```

To locally run the application:
``` npm start ```  
A new tab should open in your default browser with the application.

## How to deploy the React application?
If you want to deploy the application on your own server, you first need to set the homepage, meaning the main url of your future page.
For a tutorial to set up the server, you can check out directly [React official deployment tutorial](https://create-react-app.dev/docs/deployment/)  

Otherwise, if you wish to deploy it on the current repository (considering you are a collaborator of course), you need to open a console in the main folder and run:
``` npm run deploy ```  
The deployment might take up to a few minutes before you can access it.
