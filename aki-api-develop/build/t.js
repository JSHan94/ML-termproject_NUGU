"use strict"

const aki = require('../index');

const readline = require('readline');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

let answerId = 0;
let step = 0;

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

//example 2
exports.testGame = async (region) => {
    const startGame = await aki.start(region);
    let question = startGame["question"];
    return startGame;
   /*  if (startGame != null) {
        var i = 0;
        while(i<50) {
            answerId = await askQuestion("Type your answer : ");
            console.log("My answerId : "+answerId);
 
            let answer = await aki.step(region, startGame.session, startGame.signature, answerId, step);
            console.log(answer);
        
            if (answer.progress >= 85) {
                const guessWin = await aki.win(region, startGame.session, startGame.signature, step+1);          
                console.log("I guess: " + guessWin.answers[0].name + "\n" + guessWin.answers[0].absolute_picture_path);
                break;
            }

            else {
                step++;
                i++;
            }
        }
            
    } */
};
exports.nextstep = async (region, session, signature, answerId, step) => {
    const answer = await aki.step(region, session, signature, answerId, step);
    console.log("current session is "+session);
    console.log(answer);
    //console.log("current step is "+ step);
    if (answer.progress >= 85) {
        const guessWin = await aki.win(region, session, signature, step+1);          
        console.log("I guess: " + guessWin.answers[0].name + "\n" + guessWin.answers[0].absolute_picture_path);
        answer["final_answer"] = guessWin.answers[0].name;
    } 
    return answer;
}
exports.start = function(){
    const startGame = aki.start('kr');
    console.log("game started: " + JSON.stringify(startGame, null, 2));
    return startGame;
}

//testGame('kr');
