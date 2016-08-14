module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.buildBody =
	function(bodyO) {
		result = [];
		let funky = false;
		if(_.sum(bodyO) > 50) {
			if(bodyO.move > 10) {
				bodyO.move--;
			} else if(bodyO.carry > 10) {
				bodyO.carry--;
			} else if(bodyO.work > 10) {
				bodyO.work --;
			}
			

		}
		for(var part in bodyO) {
			if(funky) {
				console.log(part + " is " + bodyO[part]);
			}

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
	    var maxParts = 50;
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	    var creepMem = { role: roleName, combat: false, source:null, spawnRoom: this.room.name, working: false };
	if(roleName == "towerdrainer") {
		body = this.buildBody({tough:23,move:17,heal:10});
		bodyset = true;
		creepMem.combat = true;
	}
	else if(roleName == "upgrader"){
		body = this.buildBody({work:10,carry:1,move:1});
		bodyset = true;
	}
	else if(roleName == "scout") {
		body = this.buildBody({move:4});
		bodyset = true;
		creepMem.combat = true;
	}
/*	else if(roleName == "attacker") {
		body = this.buildBody({attack:5,move:6});
		bodyset = true;
		creepMem.combat = true;
	}
*/
	else if (roleName == "defender" || roleName == "attacker") {
		let Nparts = 6;
		let base = 420;
		let calcEnergy = energy - base;
		let probody = {tough:2,move:3,attack:0,heal:1}; // 420 cost body
		let defparts = Math.floor(calcEnergy / 130);
		for(let i = 0; i < defparts && Nparts <= 48; i++) {
			Nparts += 2;
			probody.attack++;
			probody.move++;
		}
		body = this.buildBody(probody);
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "sapper") {
		let Nparts = 0;
		let base = 0;
		let calcEnergy = energy - base;
		let probody = {work:0,move:0};
		let sapparts = Math.floor(calcEnergy / 250);
                for(let i = 0; i < sapparts && Nparts <= 47; i++) {
			Nparts += 3;
                        probody.work++;
			probody.work++;
                        probody.move++;
                }
                body = this.buildBody(probody);
                bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "miner" || roleName == "remoteminer") {
		body = this.buildBody({carry:1,move:2,work:5});
		bodyset = true;
	}
	else if (roleName == "healer") {
		body = this.buildBody({move:7,heal:7});
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "claimer") {
		body = this.buildBody({claim:4,move:4});
		bodyset = true;
	}
        else if (roleName == "remoteharvester") {
		body = this.buildBody({work:2,carry:9,move:11});
                bodyset = true;
        }
	else if ((roleName == "harvester" && energy >= 1000) || roleName == "gc") {
		let harvbody = {carry:0,move:0};
		let energyLeft = energy;
		let i = 1;
		let Nparts = 0;
		while(energyLeft > 0 && Nparts < 50) {
			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 && Nparts >= 50) break;
			harvbody.move++;
			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 && Nparts >= 50) break;
			harvbody.carry++;
			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 && Nparts >= 50) break;
			harvbody.carry++;
			i++;
		}

		body = this.buildBody(harvbody);
		bodyset = true;
	}
	else if (roleName == "fetcher" || roleName == "remotefetcher") {
		let fetchbody = {work:1,move:10,carry:19};
		/*
 		let energyLeft = energy - 200;
		while(energyLeft > 0) {
			fetchbody.carry++;
			energyLeft -= 50;
			if(energyLeft == 0) break;
			fetchbody.move++;
			energyLeft -= 50;
			if(energyLeft == 0) break;
			fetchbody.carry++;
			energyLeft -= 50;
		}
		*/
		body = this.buildBody(fetchbody)
		bodyset = true;
        }



	if(!bodyset) {
		let Nparts = 0;
            for (let i = 0; i < numberOfParts && Nparts <=47; i++) {
		Nparts += 3;
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
	return checkResult;
        };
        StructureSpawn.prototype.findFlag =
        function(role) {
		let spawn = this;
                for(let i = 1; i <= 50  ; i++) {
                        flagName = role +"Spot" + i.toString();
                        if(Game.flags[flagName] != null) {
                                let flag = Game.flags[flagName];
                                let residentCreep = null;
                                residentCreep = Game.getObjectById(flag.memory[role]);
				if(flag.memory.room != spawn.room.name) {
					continue;
				}
                                if(residentCreep == null || residentCreep.checkTimeToReplace()) {
                                        return flagName
                                }
                        } else {
                                return false;
                        }
                }
        return false;
        };
};
