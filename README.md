# BOARD

A web application for reviewing video games, rating games you've played, creating lists, and discussing video games with others!

# Set Up

Dependencies:
	nodeJS = ^12.5.0
	TypeScript = 3.5.2

Install TypeScript and ts-node

npm install -g typescript

npm install -g ts-node

Go into package.json and add script for tsc:

"scripts": {
	"tsc": "tsc"
},

Then can run typescript functions.

npm run tsc -- --init

This generates tsconfig.json file. 


Can set outDir

Install express, types for express, and body parser

npm install express @types/express body-parser --save

Testing git
