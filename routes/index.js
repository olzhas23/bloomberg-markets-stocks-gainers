var express = require('express');
var router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var http = require('http');
var fs = require('fs'),obj;


var server = http.createServer(router);
var mustache = require('mustache');


router.get('/', function(req, res, next) {
   url = 'http://www.bloomberg.com/markets/stocks/';
 
    request(url, function(error, response , html){
    	
        if(!error){
            var $ = cheerio.load(html);
    	    
    	    //object constructor

    	    function stock(name, price, ticker,change){
					this.Name=name;
					this.Ticker=ticker;
					this.Price = price;
					this.Change=change;
				};

			var a, b, c;
			var i = 1;
			var arr=[];

            $('.dual_border_data_table.right_margin tr').filter(function(){
                var data = $(this);    	
    	        console.log('counter',i);
    	        //function set buffer
    	        //function to load data
                load(data, i);

                i +=1; // counter

                //BEGIN
                function load(file, counter){

				
				if (file.children().eq(0).text()=='Top Gainer' && file.children().eq(1).text() == 'Price' && file.children().eq(2).text() == '% Change' ){
					console.log('Headers');

				}
				else if (file.children().eq(0).text()!=a && file.children().eq(1).text() != b && file.children().eq(2).text() != c){
					a = file.children().eq(0).text();
					
					b = file.children().eq(1).text();
					
					c = file.children().eq(2).text();
					
					buffer(a,b,c, counter);

				}
				else
				{
					console.log('Null');
				}

               	}

               	//END OF FUNCTION LOAD


               	//BEGIN BUFFER
               	

				function buffer(a,b,c, counter) {
					    // Do Stuff
					    
					    var obj = {stock: a, price: b, change: c};
					    
					    if (counter < 65){
						
					    				    
					    arr.push(obj);
					
					}
					    else {
					    	write(arr);
					    }
				}
				//END BUFFER ARRAY


				//BEGIN WRITE

				function write(array){

					var outputFilename = 'stocks.json';

					fs.writeFile(outputFilename, JSON.stringify({array: array }, null, 4), function(err) {
					    if(err) {
					      console.log(err);
					    } else {
					      console.log("JSON saved to " + outputFilename);
					    }
					}); 
				}               	

               	//END OF WRITE

            });                               
            }
});
});



router.get('/:slug', function(req, res){

	fs.readFile('stocks.json', handleFile)

	// Write the callback function
	function handleFile(err, data) {
	    if (err) throw err
	    obj = JSON.parse(data);	
		var slug = [req.params.slug][0];
		var rData = {array:obj.array};
		console.log(rData);
		var page = fs.readFileSync(slug, "utf-8");
		var html = mustache.to_html(page,rData);
		res.send(html);
	    
	}

});


module.exports = router;
