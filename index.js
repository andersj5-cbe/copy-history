var fs = require("fs");

/**
 * copyHistory copies a chrome history for target user on target computer so it can be read if chrome is open.
 * @param {String} computer - name of target computer
 * @param {Object} options
 * @param {String} options.path Network URI for folder storing history
 * @param {String} options.source Source file name
 * @param {String} options.target File name after being copied
 * @param {String} user - name of target user
 * @param {requestedCallback} cb - callback to handle the returned path of the new file.
 */
function copyHistory(computer,options,user,cb){
    if(cb == null && typeof options != "function"){
        cb = user;
        user = options;
        options = {};
    }
    if(typeof options == "function"){
        cb = options;
        options = computer;
    }
    var path = options.path || "\\\\"+computer+"\\C$\\Users\\"+user+"\\AppData\\Local\\Google\\Chrome\\User Data\\Default"
    var source = options.source || path+"\\history"
    var target = options.target || path+"\\history1"
    
    var cbCalled = false;
    
    var rd = fs.createReadStream(source);
    rd.on("error",function(err){
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error",function(err){
        done(err);
    });
    wr.on("close",function(ex){
        path = target;
        done(null,target);
    });
    rd.pipe(wr);

  
    function done(err,target){
        if(!cbCalled){
            if(err){
                console.log(err);
            }
            cb(null,target);      
            cbCalled = true;
        }
    }
}

module.exports = copyHistory;