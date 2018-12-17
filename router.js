module.exports = function(app, fs, t)
{
     app.get('/',function(req,res){
        res.render('index.html')
     });
     app.get('/about',function(req,res){
        res.render('about.html');
    });

    app.get('/list', function(req, res) {
        fs.readFile(__dirname + '\\data\\user.json', 'utf8', function(err, data){
            console.log(__dirname + '\\data\\user.json');
            console.log(data);
            res.end(data);
        });
    });

    app.get('/getUser/:username', function(req, res){
        fs.readFile(__dirname + "\\data\\user.json", 'utf8', function (err, data){
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;
        
        console.log(req.body);
        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "\\data\\user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "\\data\\user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });


    app.put('/updateUser/:username', function(req, res){

        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA
        fs.readFile( __dirname + "\\data\\user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            // ADD/MODIFY DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "\\data\\user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
    });


    app.delete('/deleteUser/:username', function(req, res){
        var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "\\data\\user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            // DELETE FROM DATA
            delete users[req.params.username];

            // SAVE FILE
            fs.writeFile(__dirname + "\\data\\user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })

    });


    //test implement
    var Sum_Num = 0;
    var Sum_Num_Dealer = 0;
    var userCards = [];
    var dealerCards = [];
    var Dealer_Card_String = "";
    
    function getUserCard() { //Draw User's card, push it into userCards[] and return value
        var drawCard = 0;
        while(1){
            drawCard = parseInt(Math.random() * 52);
            if( !userCards.includes(drawCard) && !dealerCards.includes(drawCard)){
                userCards.push(drawCard);
                return drawCard;
            }
        }
    }
    
    function getDealerCard() { //Draw User's card, push it into userCards[] and return value
        var drawCard = 0;
        while(1){
            drawCard = parseInt(Math.random() * 52);
            if( !userCards.includes(drawCard) && !dealerCards.includes(drawCard)){
                dealerCards.push(drawCard);
                return drawCard;
            }
        }
    }
    
    
    
    function getCardShape(num) {
        switch(num % 4 ){
            case 0: return "스페이드";
            case 1: return "다이아";
            case 2: return "하트";
            case 3: return "클로버";
        }
    }
    
    function getCardNum(num) {
        var cardNum = parseInt(num / 4) + 1;
        switch( cardNum ){
            case 1: return "에이";
            case 13: return "케이";
            case 12: return "큐";
            case 11: return "제이";
            default: return cardNum.toString();
        }
    }
    
    function calcCardSum( cardList ){
        
        var sum = 0;
        for (i in cardList){
            var card_val = parseInt(cardList[i] / 4 + 1);
            if (card_val > 10) { card_val = 10; }
            if (card_val == 1) { card_val = 11; }
            sum += card_val;
        }
        return sum;
    }
    
    
    
    
    app.post('/blackjack.start', function(req, res){
        console.log(req.body);
        console.log(req.body["action"]["parameters"]["test_parameter"]);
        
        Sum_Num = 0;
        Sum_Num_Dealer = 0;
        userCards.splice(0, userCards.length);
        dealerCards.splice(0, dealerCards.length);
        var Dealer_Card_String = "";
        
        var card1 = getUserCard();
        var card2 = getUserCard();
        var dealercard = getDealerCard();
        getDealerCard();
        console.log(card1);
        console.log(card2);
        console.log(userCards);
        console.log(calcCardSum(userCards));
        
        var result = {};
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["Shape_1"] = getCardShape(card1);
        output["Num_1"] = getCardNum(card1);
        output["Shape_2"]= getCardShape(card2);
        output["Num_2"]= getCardNum(card2);
        output["Sum_Num"]= calcCardSum(userCards);
        output["Dealer_First_Shape"] = getCardShape(dealercard);
        output["Dealer_First_Num"] = getCardNum(dealercard);
        output["Is_Boomed"]= calcCardSum(userCards) > 21 ? "False" : "True";
        result["output"] = output;
        console.log('POST from NUGU');
        res.json(result);
        console.log(result);
        return;
    });
/*    app.post('/blackjack.start', function(req, res){
        console.log(req.body);
        console.log(req.body["action"]["parameters"]["test_parameter"]);
        var result = {};
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["Shape_1"] = "다이아";
        output["Num_1"] = "9";
        output["Shape_2"]= "스페이드";
        output["Num_2"]= "3";
        output["Sum_Num"]= "12";
        output["Is_Boomed"]= "False";
        result["output"] = output;
        console.log('POST from NUGU');
        res.json(result);
        console.log(result);
        return;
    }); */

    app.post('/blackjack.go', function(req, res){
        var card = getUserCard();
        getDealerCard();
        var result = {};
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["Shape_New"] = getCardShape(card);
        output["Num_New"] = getCardNum(card);
        output["Is_Boomed"]= calcCardSum(userCards) <= 21 ? "False" : "True";
        output["Sum_Num"] = calcCardSum(userCards);
        if(calcCardSum(userCards) > 21){
            result["resultCode"] = "error_burst";
            output["Boom_String"] = "패배했습니다.";            
        }
        result["output"] = output;
        res.json(result);
        return;
    });
    for(var i = 2; i <= 7; i++){
        app.post('/blackjack.go' + i.toString(), function(req, res){
            var card = getUserCard();
            getDealerCard();
            var result = {};
            result["version"] = "2.0";
            result["resultCode"] = "OK";
            var output = {};
            output["Shape_New"] = getCardShape(card);
            output["Num_New"] = getCardNum(card);
            output["Is_Boomed"]= calcCardSum(userCards) <= 21 ? "False" : "True";
            output["Sum_Num"] = calcCardSum(userCards);
            if(calcCardSum(userCards) > 21){
                result["resultCode"] = "error_burst";
                output["Boom_String"] = "패배했습니다.";                
            }
            result["output"] = output;
            res.json(result);
            return;
        });
    }

    app.post('/blackjack.stop', function(req, res){
        var dealernum = calcCardSum(dealerCards);
        var usernum = calcCardSum(userCards);/* 
        console.log("dealernum < usernum ? : " + (dealernum < usernum));
        console.log("dealernum <= 21 ? : " + (dealernum <= 21));
        console.log("Final truth : "+ ((dealernum < usernum) && (dealernum <= 21))); */
        while((dealernum < usernum) && (dealernum <= 21)){
            getDealerCard();
            dealernum = calcCardSum(dealerCards);/* 
            console.log("dealernum < usernum ? : " + dealernum < usernum);
            console.log("dealernum <= 21 ? : " + dealernum <= 21); */
        }
        var result = {};
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["Sum_Num"] = usernum.toString();
        output["Sum_Num_Dealer"] = dealernum.toString();
        var dealernum_string = "";
        for(i in dealerCards){
            dealernum_string += getCardShape(dealerCards[i]) + ' ' + getCardNum(dealerCards[i]) + ', '
        }
        output["Dealer_Card_String"] = dealernum_string;
        if((dealernum < usernum) || (dealernum >= 22)){/* 
            console.log("dealer < user : " + (dealernum < usernum));
            console.log("dealer < 22 : " + (dealernum < 22)); */
            output["Result"] = '이겼';
        } else {/* 
            console.log("dealer < user : " + (dealernum < usernum));
            console.log("dealer < 22 : " + (dealernum < 22)); */
            output["Result"] = '졌';
        }
        result["output"] = output;
        res.json(result);
        console.log(result);
        return;
    })

    for(var i = 2; i <= 7; i++){
        app.post('/blackjack.stop' + i.toString(), function(req, res){
            var dealernum = calcCardSum(dealerCards);
            var usernum = calcCardSum(userCards);/* 
            console.log("dealernum < usernum ? : " + (dealernum < usernum));
            console.log("dealernum <= 21 ? : " + (dealernum <= 21)); */
            while((dealernum < usernum) && (dealernum <= 21)){
                getDealerCard();
                dealernum = calcCardSum(dealerCards);/* 
                console.log("dealernum < usernum ? : " + dealernum < usernum);
                console.log("dealernum <= 21 ? : " + dealernum <= 21); */
            }
            var result = {};
            result["version"] = "2.0";
            result["resultCode"] = "OK";
            var output = {};
            output["Sum_Num"] = usernum.toString();
            output["Sum_Num_Dealer"] = dealernum.toString();
            var dealernum_string = "";
            for(i in dealerCards){
                dealernum_string += getCardShape(dealerCards[i]) + ' ' + getCardNum(dealerCards[i]) + ', '
            }
            output["Dealer_Card_String"] = dealernum_string;
            if((dealernum < usernum) || (dealernum >= 22)){/* 
                console.log("dealer < user : " + dealernum < usernum);
                console.log("dealer < 22 : " + dealernum < 22); */
                output["Result"] = '이겼';
            } else {/* 
                console.log("dealer < user : " + dealernum < usernum);
                console.log("dealer < 22 : " + dealernum < 22); */
                output["Result"] = '졌';
            }
            result["output"] = output;
            res.json(result);
            console.log(result);
            return;
    })}

    app.post('/akinator.start', async function(req, res){
        const game = await t.testGame('kr');
        var result = {};
        console.log(game["question"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        //output["number"] = "다이아";
        output["question"] = game["question"];
        //output["final_answer"]= game.answers;
        result["output"] = output;
        console.log('POST from NUGU');
        app.set("step", 0);
        app.set("session", game.session);
        app.set("signature", game.signature);
        console.log(app.get("session"));
        res.json(result);
        console.log(result);
        return;
    });

    var step =0;
    for(var i = 1; i <= 20; i++){
        app.post('/akinator.answer' + i.toString(), async function(req, res){
            var choice = req.body["action"]["parameters"]["select"]["type"];
            
            var result = {};
    
            //console.log(answer["nextQuestion"]);
            result["version"] = "2.0";
            result["resultCode"] = "OK";
            var output = {};        
            result["output"] = output;
            //console.log(choice);
            console.log("your answer is "+ choice);
            var answerId =2;
            if(choice=="POSITIVE"){
                answerId = 0;
            }else if(choice =="NEGATIVE"){
                answerId =1;
            }
            console.log("your answerId is "+ answerId);
            const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,app.get("step"));
            app.set("step", app.get("step") + 1);
            if(!answer["nextQuestion"]){
                output["final_answer"] = answer;
            } else {
                output["question"] = answer["nextQuestion"];
            }
            
        if(answer.progress >= 85){
            console.log("finished!");
            result["resultCode"]="Finished";
            output["final_answer"] = answer["final_answer"];
        }
            //console.log('POST from NUGU');
            res.json(result);
            return;
        });
    }

    app.post('/akinator.final_answer', async function(req, res){
        var choice = req.body["action"]["parameters"]["select"]["type"];
        
        var result = {};

        //console.log(answer["nextQuestion"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};        
        result["output"] = output;
        //console.log(choice);
        console.log("your answer is "+ choice);
        var answerId =2;
        if(choice=="POSITIVE"){
            answerId = 0;
        }else if(choice =="NEGATIVE"){
            answerId =1;
        }
        console.log("your answerId is "+ answerId);
        const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,app.get("step"));
        if(answer.progress >= 85){
            output["resultCode"]="Finished";
            output["final_answer"] = answer["final_answer"];
        }
        output["question"] = answer["nextQuestion"];
        //console.log('POST from NUGU');
        res.json(result);
        return;
    })

    app.get('/health', function(req, res){
        var result = {};
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        result["output"] = {};
        res.json(result);
    })
    /* app.post('/akinator.answer1', async function(req, res){
        var choice = req.body["action"]["parameters"]["select"]["type"];
        
        var result = {};

        //console.log(answer["nextQuestion"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};        
        result["output"] = output;
        //console.log(choice);
        console.log("your answer is "+ choice);
        var answerId =2;
        if(choice=="POSITIVE"){
            answerId = 0;
        }else if(choice =="NEGATIVE"){
            answerId =1;
        }
        console.log("your answerId is "+ answerId);
        const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,app.get("step"));
        app.set("step", app.get("step") + 1);
        
        output["question"] = answer["nextQuestion"];
        //console.log('POST from NUGU');
        res.json(result);
        return;
    });
    app.post('/akinator.answer2', async function(req, res){
        var choice = req.body["action"]["parameters"]["select"]["type"];
        //console.log(choice);
        console.log("your answer is "+ choice);
        var answerId =2;
        if(choice=="POSITIVE"){
            answerId = 0;
        }else if(choice =="NEGATIVE"){
            answerId =1;
        }
        console.log("your answerId is "+ answerId);
        step++;
        const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,app.get("step"));
        app.set("step", app.get("step") + 1);
        var result = {};
        //console.log(answer["nextQuestion"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["question"] = answer["nextQuestion"];
        result["output"] = output;
        //console.log('POST from NUGU');
        res.json(result);
        return;
    });
    app.post('/akinator.answer3', async function(req, res){
        var choice = req.body["action"]["parameters"]["select"]["type"];
        //console.log(choice);
        console.log("your answer is "+ choice);
        var answerId =2;
        if(choice=="POSITIVE"){
            answerId = 0;
        }else if(choice =="NEGATIVE"){
            answerId =1;
        }
        console.log("your answerId is "+ answerId);
        step++;
        const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,app.get("step"));
        app.set("step", app.get("step") + 1);
        var result = {};
        //console.log(answer["nextQuestion"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        output["question"] = answer["nextQuestion"];
        result["output"] = output;
        //console.log('POST from NUGU');
        res.json(result);
        return;
    }); */
    // var step =0;
    // var i = 0;
    // for(i = 1; i <= 20; i++){
    //     app.post('/akinator.answer' + i.toString(), async function(req, res){
    //         var choice = req.body["action"]["parameters"]["select"]["type"];
    //         //console.log(choice);
    //         console.log("your answer is "+ choice);
    //         var answerId =2;
    //         if(choice=="POSITIVE"){
    //             answerId = 0;
    //         }else if(choice =="NEGATIVE"){
    //             answerId =1;
    //         }
    //         console.log("your answerId is "+ answerId);
    //         step++;
    //         const answer = await t.nextstep('kr', app.get("session"), app.get("signature"), answerId,step);
    //         var result = {};
    //         //console.log(answer["nextQuestion"]);
    //         result["version"] = "2.0";
    //         result["resultCode"] = "OK";
    //         var output = {};
    //         output["question"] = answer["nextQuestion"];
    //         result["output"] = output;
    //         //console.log('POST from NUGU');
    //         res.json(result);
    //         return;
    //     });
    // }
    /* app.post('/akinator.answer1', async function(req, res){
        var choice = req.body["action"]["parameters"];
        const answer = await t.next('kr', app.get("session"), app.get("signature"), 0);
        console.log(answer);
        var result = {};
        console.log(answer["nextQuestion"]);
        result["version"] = "2.0";
        result["resultCode"] = "OK";
        var output = {};
        //output["number"] = "다이아";
        output["question"] = answer["nextQuestion"];
        //output["final_answer"]= game.answers;
        result["output"] = output;
        console.log('POST from NUGU');
        res.json(result);
        return;
    }); */
}