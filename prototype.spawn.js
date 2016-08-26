var needed = require('getNeeded');

module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.buildBody =
	function(bodyO,movelast) {
		if(movelast != true) {
			movelast = false;
		}
		result = [];
		let funky = false;
		if(_.sum(bodyO) > 50) {
			if(bodyO.attack != undefined && bodyO.attack > 10) {
				bodyO.attack--;
			} else if(bodyO.carry != undefined && bodyO.carry > 10) {
				bodyO.carry--;
			} else if(bodyO.work != undefined && bodyO.work > 10) {
				bodyO.work --;
			} else if(bodyO.move != undefined && bodyO.move > 10) {
                                bodyO.move--;
			}
			

		}
		for(var part in bodyO) {
			if(funky) {
				console.log(part + " is " + bodyO[part]);
			}

			for(let i = 0; i < bodyO[part]; i++) {
				if((movelast == true && part != "MOVE" && part != "move") || (i+1 != bodyO[part])) {
					result.push(part);
				}
			}
		}
	if(movelast != true) {
		result.push("move");
	};
	return result;
	};
		

    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
	    var nameNumber = 1;
	    if(roleName == undefined || roleName == "undefined") {
		console.log("[" + this.name + "] tried to spawn an undefined");
	    }
	    var name=roleName + nameNumber.toString();
	    while(Game.creeps[name] != undefined) {
		nameNumber++;
		name=roleName + nameNumber.toString();
		if(nameNumber > 100) {
			break;
		}
	    }
	    var maxParts = 50;
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	    var creepMem = { role: roleName, combat: false, source:null, spawnRoom: this.room.name, working: false };



	if(roleName == "towerdrainer") {
		let Nparts = 6;
                let base = 240;
                let calcEnergy = energy - base;
                let probody = {tough:4,move:4,heal:0}
                let defparts = Math.floor(calcEnergy / 300);
                for(let i = 0; i < defparts && Nparts <= 48; i++) {
                        Nparts += 2;
                        probody.heal++;
                        probody.move++;
			
                }
                body = this.buildBody(probody, false);
                bodyset = true;
                creepMem.combat = true;
        }
	else if(roleName == "groundskeeper") {
		bodyset = true;
		if(energy >= 2900) {
			body = this.buildBody({move:17,work:8,carry:25});	
		} else if(energy >= 2000) {
			body = this.buildBody({move:12,work:4,carry:20});
		} else if(energy >= 1000) {
			body = this.buildBody({move:6,work:2,carry:10});
		} else {
			bodyset = false;
		}
	}
	else if(roleName == "upgrader"){
		if(energy >= 2200) {
			body = this.buildBody({work:20,carry:2,move:2});
		} else if(energy >= 1100) {
			body = this.buildBody({work:10,carry:1,move:1});
		} else if(energy >= 550){
			body = this.buildBody({work:4,carry:1,move:2});
		} else {
			body = this.buildBody({work:1,carry:1,move:1});
		}
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
		if(energy >= 800) {
		body = this.buildBody({carry:1,move:3,work:6});
		} else {
		body = this.buildBody({work:5,move:1});
		}
		bodyset = true;
	}
	else if (roleName == "healer") {
		if(energy >= 4500) {
			body = this.buildBody({move:15,heal:15});
		} else if(energy >= 2100) {
			body = this.buildBody({move:7,heal:7});
		} else if(energy >= 1200) {
			body = this.buildBody({move:4,heal:4});
		} else if(energy >= 600) {
			body = this.buildBody({move:2,heal:2});
		}
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "claimer") {
		if(energy >= 2600) {
			body = this.buildBody({claim:4,move:4});
		} else if (energy >= 1300) {
			body = this.buildBody({claim:2,move:2});
		}
		bodyset = true;
	}
	else if(roleName == "actualclaimer") {
		body = this.buildBody({claim:1,move:1})
		bodyset = true;
	}
	else if (roleName == "remoteupgrader") {
		body = this.buildBody({work:10,carry:1,move:10});
		bodyset = true;
	}
        else if (roleName == "remoteharvester") {
		body = this.buildBody({work:2,carry:9,move:11});
                bodyset = true;
        }
	else if ((roleName == "harvester" && energy >= 800) || roleName == "gc" || roleName == "upgradertinder") {
		let harvbody = {carry:0,move:0};
		creepMem.combat = true;
		let energyLeft = energy;
		let Nparts = 0;
		while(energyLeft > 0 && Nparts < 50) {
			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 || Nparts > 50) break;
			harvbody.move++;

			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 || Nparts > 50) break;
			harvbody.carry++;

			energyLeft -= 50;
			Nparts++;
			if(energyLeft < 0 || Nparts > 50) break;
			harvbody.carry++;
		}

		body = this.buildBody(harvbody);
		bodyset = true;
	}
	else if (roleName == "fetcher" || roleName == "remotefetcher" || roleName == "feeder" || roleName == "lgfetcher") {
		let fetchbody = {};
		if(roleName == "feeder" && energy >= 2400) {
			fetchbody = {carry:32,move:16};
		}
		else if(energy >= 2450) {
			fetchbody = {work:1,move:16,carry:31};
		}
		else if(energy >= 1550) {
			fetchbody = {work:1,move:10,carry:19};
		}
		else if(energy >= 950) {
			fetchbody = {work:1,move:6,carry:11};
		}
		else if(energy >= 900) {
			fetchbody = {move:6,carry:12};
		}
		else if(energy >= 450) {
			fetchbody = {move:3,carry:6};
		}
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
        } else if (roleName == "linktender") {
		ltbody = {move:1, carry:16};
		body = this.buildBody(ltbody);
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
		message = "[" + this.name + "] tried to spawn " + name + " but received error: ";
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
		console.log(message+ err);
	
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


	StructureSpawn.prototype.handlespawn =
	function(roles,dontBuild) {
		var mySpawn = this;
		if(mySpawn.spawning != null) {
			return false;
		}
		var myActualEnergy = mySpawn.room.energyAvailable;
		var energyCap = mySpawn.room.energyCapacityAvailable;
		var energyMax = energyCap;
		if(mySpawn.room.memory.maxEnergy != undefined) {
			energyMax = Math.min(mySpawn.room.memory.maxEnergy, energyCap);
		}
		var myEnergy = Math.min(energyMax, myActualEnergy);
		var name = undefined;
		var job = null;
		var readyToSpawn = false;
		var readyToMaxSpawn = false;
		var roomroles = Memory.rooms[mySpawn.room.name].role;

		if(myActualEnergy == energyCap || Math.floor(energyCap / 200) == Math.floor(myActualEnergy / 200)) {
			readyToMaxSpawn = true;
		}

		if(myEnergy >= energyMax || Math.floor(energyMax / 200) == Math.floor(myEnergy/200)) {
			readyToSpawn = true;
		}

		if(mySpawn.spawning != null) {
			readyToSpawn = false;
			readyToMaxSpawn = false;
		}

		if(Memory.rooms[mySpawn.room.name].totalCreeps == 0) {
			Memory.rooms[mySpawn.room.name].bootstraping = true;
		}

		if(roomroles["harvester"].current == 0) {
			name = mySpawn.createCustomCreep(myEnergy, 'harvester');
			if (!(name < 0) && name != undefined) {
				Memory.rooms[mySpawn.room.name].role["harvester"].current++;
			}
		} else {
			Memory.rooms[mySpawn.room.name].goingToSpawn = [];
			for(let roleM in roles) {
				let roleMem = roomroles[roleM];
				let role = roles[roleM];
				if(roleM == "undefined") continue;
				let minimum = needed.getNeeded(role.namer,mySpawn.room.name);
				if(minimum > roleMem.current) {
					Memory.rooms[mySpawn.room.name].goingToSpawn.push(role.namer);
					if((role.buildRestriction == true && dontBuild == true) || (Memory.rooms[mySpawn.room.name].bootstraping == true && role.namer != "harvester")) {
						continue;
					}
					if(roleMem.requirement > 0 && myActualEnergy >= roleMem.requirement && mySpawn.spawning == null) {
						name = mySpawn.createCustomCreep(roleMem.requirement, role.namer);
					}
					else if(roleMem.requirement == -1 && readyToMaxSpawn) {
						name = mySpawn.createCustomCreep(myActualEnergy, role.namer);
					}
					else if(roleMem.requirement == 0 && readyToSpawn) {
						name = mySpawn.createCustomCreep(myEnergy, role.namer);
					}
					else if(role.namer == "harvester" || role.namer == "linktender") {
						break;
					}
				} else if (role.namer == "harvester") {
					Memory.rooms[mySpawn.room.name].bootstraping = false;
				}
				if(!(name < 0) && name != undefined) {
					Memory.rooms[mySpawn.room.name].goingToSpawn.pop();
					Memory.rooms[mySpawn.room.name].role[role.namer].current++;
					break;
				} else if(name < 0) { 
					console.log("Tried to spawn a " + role.namer + " but got error " + name);
				}
			}
		}
		if (!(name < 0) && name != undefined) {
			console.log("[" + mySpawn.name + "] Spawned new creep: " + name );
		}
	}
};
