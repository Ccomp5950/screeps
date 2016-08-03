module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.buildBody =
	function(bodyO) {
		result = [];
		for(var part in bodyO) {
			for(let i = 0; i < bodyO[part]; i++) {
				if((part != "MOVE" && part != "move") || (i+1 != bodyO[part])) {
					result.push(part);
				}
			}
		}
	result.push("move");
	return result;
	};
		

    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
	    var nameNumber = 1;
	    var name=roleName + nameNumber.toString();
	    while(Game.creeps[name] != undefined) {
		nameNumber++;
		name=roleName + nameNumber.toString();
		if(nameNumber > 20) {
			break;
		}
	    }
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	if(roleName == "towerdrainer") {
		body = this.buildBody({tough:5,move:9,heal:4});
		bodyset = true;
	}
	if(roleName == "scout") {
		body = this.buildBody({move:3,carry:1});
		bodyset = true;
	}
	else if(roleName == "attacker") {
		body = this.buildBody({attack:5,move:6});
		bodyset = true;
	}
	else if (roleName == "defender") {
		body = this.buildBody({tough:6,attack:3,move:5,heal:1});
		bodyset = true;
	}
	else if (roleName == "miner") {
		body = this.buildBody({work:5,carry:1,move:2});
		bodyset = true;
	}
	else if (roleName == "claimer") {
		body = this.buildBody({claim:2,move:2});
	}
        else if (roleName == "remoteharvester") {
		body = this.buildBody({work:2,carry:9,move:11});
                bodyset = true;
        }
	else if (roleName == "harvester" && energy >= 1000) {
		body = this.buildBody({work:1,carry:10,move:8});
		bodyset = true;
	}
	else if (roleName == "fetcher") {
		for(let i = 0; i < (numberOfParts * 2); i++) {
			body.push(CARRY);
			body.push(MOVE);
		}
		bodyset = true;
        }



	if(!bodyset) {
            for (let i = 0; i < numberOfParts; i++) {
                body.push(WORK);
		body.push(CARRY);
		body.push(MOVE);
            }
	}
            // create creep with the created body and the given role
	    let checkResult = this.canCreateCreep(body, name);
	    
	    if(checkResult == 0) {
	            return this.createCreep(body, name, { role: roleName, working: false, source: null });
	    } else {
		message = "tried to spawn " + name + "but received error: ";
		let err = "";
		switch(checkResult) {
			case 0:
				err = "OK!";	
				break;
			case -1:
				err = "You do not own this spawn";
				break;
			case -3:
				err = "The name already exists";
				break;
			case -4:
				err = "Spawn is busy";
				break;
			case -6:
				err = "Not enough energy (" + energy + ")";
				break;
			case -10:
				err = "Invalid arguments";
				break;
			case -14:
				err = "Not high enough RCL";
				break;
		}
		console.log(message + err);
	    }
        };
};
