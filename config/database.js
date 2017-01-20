/*
	The module.exports or exports is a special object which is included in 
	every JS file in the Node.js application by default. 

	module is a variable that represents current module 
	and exports is an object that will be exposed as a module. 

	So, whatever you assign to module.exports or exports,
	will be exposed as a module.

	This is the path to our local MongoDB and an app secret for encoding our JWT.

*/

module.exports = {
  'secret': '-0123456789-mysecretyutility012017#-asdfasdfasdf15616847sadfadsf154',
  'database': 'mongodb://localhost/utilityBill'
};
