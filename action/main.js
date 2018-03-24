var xBtn, oBtn, reBtn, cells;
var userRole, comRole, nowRole;
var winArray, userArray, comArray, overArray;

$(document).ready(function(){
    xBtn = $("#xBtn");
    oBtn = $("#oBtn");
    reBtn = $("#reBtn");
    cells = $(".cell");

    $.each(cells, function(key, value){
        value.index = key + 1;
    });

    userRole = '';
    comRole = '';
    nowRole = '';
    winArray = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
    ];
    userArray = [];
    comArray = [];
    overArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    xBtn.bind("click", chooseRole);
    oBtn.bind("click", chooseRole);
    reBtn.bind("click", reset);
});

function chooseRole(event){
    xBtn.unbind("click", chooseRole);
    oBtn.unbind("click", chooseRole);
    
    if(event.target == xBtn[0]){
        userRole = "X";
        comRole = "O";
        nowRole = "X";
    }else if(event.target == oBtn[0]){
        userRole = "O";
        comRole = "X";
        nowRole = "X";
    }

    run();
}
function reset(){
    userRole = '';
    comRole = '';
    nowRole = '';
    userArray = [];
    comArray = [];
    overArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    xBtn.bind("click", chooseRole);
    oBtn.bind("click", chooseRole);
    cells.find("div").hide();
    cells.unbind("click", cellClick);
    tip("Chen");
}
function run(){
    if(check()){
        if(nowRole == userRole){
            userTurn();
        }else if(nowRole == comRole){
            comTurn();
        }
    }
}
function userTurn(){
    tip("You Turn");
    $.each(cells, function(key, value){
        $(value).bind("click", cellClick);
    });
}
function cellClick(){
    if(overArray.indexOf(this.index) >= 0){
        $.each(cells, function(key, value){
            $(value).unbind("click", cellClick);
        });

        $(this).find("." + userRole).toggle();

        userArray.push(this.index);
        overArray.splice(overArray.indexOf(this.index), 1);

        nowRole = comRole;
        run();
    }else{
        tip("Wrong Click!");
    }
}
function comTurn(){
    tip("Com Turn");
    var index = searchIndex();

    setTimeout(() => {
        cells.eq(index - 1).find("." + comRole).toggle();

        comArray.push(index);
        overArray.splice(overArray.indexOf(index), 1);

        nowRole = userRole;
        run();
    }, 500);
}
function searchIndex(){
    if(comRole == "X" && comArray.length == 0){
        return 1;
    }else if(comRole == "O" && comArray.length == 0){
        switch(userArray[0]){
            case 1 : return 9;
            case 2 : return 7;
            case 3 : return 7;
            case 4 : return 9;
            case 5 : return 1;
            case 6 : return 1;
            case 7 : return 3;
            case 8 : return 3;
            case 9 : return 1;
        }
    }else if(comRole == "X" && comArray.length == 1){
        switch(userArray[0]){
            case 2 : return 5;
            case 3 : return 9;
            case 4 : return 5;
            case 5 : return 9;
            case 6 : return 5;
            case 7 : return 9;
            case 8 : return 5;
            case 9 : return 3;
        }
    }else{
        var one = oneStep();
        var two = twoStep();
        var ran = overArray[Math.floor(Math.random() * overArray.length)];
        if(one){
            return one;
        }else if(two){
            return two;
        }else{
            return ran;
        }
    }
}
function oneStep(){
    for(var i in overArray){
        var temp = overArray[i];
        for(var j in winArray){
            comArray.push(temp);
            if(arrayContain(winArray[j], comArray)){
                comArray.pop();
                return temp;
            }else{
                comArray.pop();
            }
            userArray.push(temp);
            if(arrayContain(winArray[j], userArray)){
                userArray.pop();
                return temp;
            }else{
                userArray.pop();
            }
        }
    }
    return false;
}
function twoStep(){
    for(var i = 0; i < overArray.length; i++){
        var temp1 = overArray[i];
        for(var j = i + 1; j < overArray.length; j++){
            var temp2 = overArray[j];
            for(var k in winArray){
                comArray.push(temp1);
                comArray.push(temp2);
                if(arrayContain(winArray[j], comArray)){
                    comArray.pop();
                    comArray.pop();
                    return temp1;
                }else{
                    comArray.pop();
                    comArray.pop();
                }
                userArray.push(temp1);
                userArray.push(temp2);
                if(arrayContain(winArray[j], userArray)){
                    userArray.pop();
                    userArray.pop();
                    return temp1;
                }else{
                    userArray.pop();
                    userArray.pop();
                }
            }
        }
    }
    return false;
}
function check(){
    var result = true;

    if(overArray.length == 0){
        tip("Draw!!");
        result = false;
    }else{
        for(var i in winArray){
            if(arrayContain(winArray[i], userArray)){
                tip("You Win!!");
                result = false;
            }
            if(arrayContain(winArray[i], comArray)){
                tip("Com Win!!");
                result = false;
            }
        }
    }

    return result;
}
function arrayContain(small, big){
    if(big.length < 3){
        return false;
    }
    for(var i in small){
        if(big.indexOf(small[i]) < 0){
            return false;
        }
    }

    return true;
}
function tip(mes){
    $("#tip>span").text(mes);
}