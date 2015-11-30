var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var http = require('http');
var fs = require('fs'),obj;
var pg = require('pg');


var server = http.createServer(router);
var mustache = require('mustache');

//Here we will get the data from bloomberg website

router.get('/', function(req, res, next) {
   url = 'http://www.bloomberg.com/quote/INDU:IND/members';
   index = 'localhost:5000';
    request(url, function(error, response , html){
//   	
        if(!error){
            var $ = cheerio.load(html);
        	parsed_stock_info = [];
//
			$('div.security-summary').each(function(i, element){
			      //number of stocks is hardcoded needs to be fixed latter.
			      var number_of_stocks = 29;
			      for (j=1; j<=i; j++){
			      var div = $(this).prev();
			      var stock_price = div.children().children().children().eq(0).text();
			      var stock_change = div.children().children().children().eq(1).text();
			      var stock_per_change = div.children().children().children().eq(2).text();
			      var stock_volume = div.children().children().children().eq(3).text();
			      var stock_time = div.children().children().children().eq(4).text();
			      var stock_name = div.children().next().text();

			      // Our parsed meta data object
			      
			      var metadata = {
			        stock_name: stock_name,
			        price: stock_price,
			        change: stock_change,
			        percent_change: stock_per_change,
			        volume: stock_volume,
			        time: stock_time
			       	
		      		};  

		      		if (i=number_of_stocks){
		      	  	//console.log(metadata,i);		
		      	  	return parsed_stock_info.push(metadata);
		      	  } 
		      	  else
		      	  {
		      	  	console.log('parsed_stock_info is empty');
		      	  }
		      	  }

		      	
		      				
			      
			      
			      
			  }
			  );
			
        	

        	write(parsed_stock_info);

			
//     


//here we are writing JSON file
				function write(array){

					var outputFilename = 'stocks.json';

					fs.writeFile(outputFilename, JSON.stringify(array, null, 8), function(err) {
					    if(err) {
					      console.log(err);
					    } else {
					      console.log(outputFilename);
					    }
					}); 
				} 
				//res.send(index);
			

}
})
}

);
			      	
//end of write




//
router.get('/:slug', function(req, res){

	fs.readFile('stocks.json', handleFile)

	// Write the callback function
	function handleFile(err, data) {
	    if (err) throw err
	    obj = JSON.parse(data);	
		var slug = [req.params.slug][0];
		var rData = {array:obj};
		var page = fs.readFileSync(slug, "utf-8");
		var html = mustache.to_html(page,rData);
		res.send(html);
	    
	}

});
//

//here is our login info to postgress on Heroku, needs to be move to another file for better security, but it is ok for now
var USER = "dtbufbkeqjknrs";
var PW = "qbq1t6x-YbKofBaiGvPAzvvUbd";
var HOST = "ec2-54-204-35-132.compute-1.amazonaws.com";
var DATABASE = "d8ivh0vd96kqa6";
var PORT = 5432;

var conString = "postgres://" + USER + ":" + PW + "@" + HOST + ":" + PORT + "/"
    + DATABASE + "?ssl=true";
var client = new pg.Client(conString);

//pg-copy streams allows us to stream our stocks.json file directly to our database, needs to be reviewed latter
var copyFrom = require ('pg-copy-streams').from; 

// Now you can start querying your database. Here is a sample. 

/*pg.connect(function(err, client, done) {
  var stream = client.query(copyFrom('COPY data FROM STDIN'));
  var fileStream = fs.createReadStream('stocks.json');
  fileStream.on('error', done);
  fileStream.pipe(stream).on('finish', done).on('error', done);
});
*/
//Here we INSERT our data to PostreSQL, WHITE database

/*client.connect(function(err, client, done) {
   if (err) { 
     return console.error('could not connect to postgresq',err);
   }

   fs.readFile('./public/data/stocks.json', handleFile)
   	function handleFile(err, data) {
	    
	    if (err) throw err
	    //here we parse stocks.json
	    obj = JSON.parse(data);	
		var rData = {array:obj.array};
		console.log('obj.length',obj.length);
		//console.log(obj);
		//push stocks.json to database
   		for ( var i =1;i < obj.length; i++){
  			var query ="INSERT INTO data (id,stockname,stockprice,stockchange,date) VALUES ($1, $2, $3, $4,$5);"
  			//console.log (obj[i].stock,obj[i].price, obj[i].change, Date());
   			client.query(query,[i,obj[i].stock,obj[i].price, obj[i].change, Date()],function(err, result) {
        	if (err) {
            	return console.log("could not complete query, last step");
        	} 
        //client.end();

        
        
console.log("Data inserted sucsesfully!");
   }
   )}
};

}

)*/


module.exports = router;
