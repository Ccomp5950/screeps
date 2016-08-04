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
	    var creepMem = { role: roleName, combat: false, source:null, spawnRoom: this.room.name };
	if(roleName == "towerdrainer") {
		body = this.buildBody({tough:36,move:10,heal:4});
		bodyset = true;
		creepMem.combat = true;
	}
	if(roleName == "scout") {
		body = this.buildBody({move:4});
		bodyset = true;
		creepMem.combat = true;
	}
	else if(roleName == "attacker") {
		body = this.buildBody({attack:5,move:6});
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "defender") {
		let base = 420;
		let calcEnergy = energy - base;
		let probody = {tough:2,attack:0,move:3,heal:1}; // 420 cost body
		let defparts = Math.floor(calcEnergy / 130);
		for(let i = 0; i < defparts; i++) {
			probody.attack++;
			probody.move++;
		}
		body = this.buildBody(probody);
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "sapper") {
		let base = 670;
		let calcEnergy = energy - base;
		let probody = {tough:2,work:0,move:3,heal:2};
		let sapparts = Math.floor(calcEnergy / 250);
                for(let i = 0; i < sapparts; i++) {
                        probody.work++;
			probody.work++;
                        probody.move++;
                }
                body = this.buildBody(probody);
                bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "miner") {
		body = this.buildBody({carry:1,move:2,work:5});
		bodyset = true;
	}
	else if (roleName == "healer") {
		body = this.buildBody({move:5,heal:5});
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "claimer") {
		body = this.buildBody({claim:2,move:2});
		bodyset = true;
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
	            checkResult =  this.createCreep(body, name, creepMem);
	    }
	    if(checkResult < 0) {
		message = "tried to spawn " + name + " but received error: ";
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
		console.log(message + err);
		}
	    }
        };
};
