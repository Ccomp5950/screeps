var needed = require('getNeeded');

module.exports = function() {
    // create a new function for StructureSpawn
    StructureSpawn.prototype.buildBody =
	function(bodyO, sort = true) {
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
				if(sort == false || (part != "MOVE" && part != "move") || (i+1 != bodyO[part])) {
					result.push(part);
				}
			}
		}
		if(sort == true) result.push("move");
	return result;
	};
		

    StructureSpawn.prototype.createCustomCreep =
        function(energy, roleName) {
            // create a balanced body as big as possible with the given energy
	    var nameNumber = 1;
	    if(roleName == undefined || roleName == "undefined") {
		console.log("[" + this.name + "] tried to spawn an undefined");
	    }
	/*
	    var name=roleName + nameNumber.toString();
	    while(Game.creeps[name] != undefined) {
		nameNumber++;
		name=roleName + nameNumber.toString();
		if(nameNumber > 100) {
			break;
		}
	    }
	 */
	    var name=null;
	    var maxParts = 50;
            var numberOfParts = Math.floor(energy / 200);
            var body = [];
	    var bodyset = false;
	    var creepMem = { role: roleName, combat: false, source:null, spawnRoom: this.room.name, working: false, needsBoosted: false};



	if(roleName == "towerdrainer") {
		if(energy >= 7500) {
			body = this.buildBody({move:25,heal:25});
			bodyset = true;
		} else if(energy >= 7300) {
			body = this.buildBody({move:24,heal:24,carry:2});
		} else {
			let Nparts = 12;
	                let base = 540;
	                let calcEnergy = energy - base;
	                let probody = {tough:4,move:6,work:2,heal:0}
	                let defparts = Math.floor(calcEnergy / 300);
	                for(let i = 0; i < defparts && Nparts <= 48; i++) {
	                        Nparts += 2;
	                        probody.heal++;
	                        probody.move++;
			
	                }
	                body = this.buildBody(probody, false);
		}
                bodyset = true;
                creepMem.combat = true;
		creepMem.needsBoosted = true;
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
	
		if(energy == 1750) {
			body = this.buildBody({work:15,carry:1,move:4});
		} else if(energy >= 3200) {
			body = this.buildBody({work:25,carry:1,move:13}); 
		} else if(energy >= 2400) {
			body = this.buildBody({work:20,carry:2,move:6});
		} else if (energy >= 2300) {
			body = this.buildBody({work:20,carry:1,move:5});
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
		if(energy >= 1750) {
			body = this.buildBody({tough:24,move:25,heal:1});
		} else {
			body = this.buildBody({move:1,carry:1});
		}
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "ranger") {
		body=this.buildBody({move:25,ranged_attack:20,heal:5}) // 4750
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "defender" || roleName == "attacker") {
		
		let Nparts = 8;
		let base = 0;
		let calcEnergy = energy - base;
		let probody = {tough:0,move:0,attack:0,heal:0};
		if(energy >  1500) {
			base = 720;
			calcEnergy = energy - base;
			probody = {tough:2,move:4,attack:0,heal:2}; // 420 cost body
		}
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
	else if (roleName == "raider" || roleName == "soloraider") {
		if(energy >= 3250) {
			body = this.buildBody({move:25,attack:25});
			bodyset = true;
			creepMem.combat = true;
		} else {
			console.log("Raiders require 3250 energy");
			return;
		}
	}
	else if (roleName == "skminer") {
		body = this.buildBody({move:17,work:10,attack:16,ranged_attack:1,heal:4,carry:2}, false);
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "labtender") {
		body = this.buildBody({carry:12,move:6});
		bodyset = true;
		creepMem.combat = true;
	}	
	else if (roleName == "sapper" || roleName == "solosapper") {
		let probody = {move:0, work:0};
		if(energy >= 4500) {
			probody = {move:10, work:40};	
		} else {
			let Nparts = 0;
			let base = 0;
			let calcEnergy = energy - base;
			let sapparts = Math.floor(calcEnergy / 150);
	                for(let i = 0; i < sapparts && Nparts <= 48; i++) {
				Nparts += 2;
				probody.work++;
	                        probody.move++;
	                }
		}
                body = this.buildBody(probody);
                bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "miner" || roleName == "remoteminer") {
		if(energy >= 1250) {
			body = this.buildBody({carry:1,move:8,work:8});
		} else if(energy >= 950) {
			body = this.buildBody({carry:1,move:6,work:6});
		} else if(energy >= 850) {
			body = this.buildBody({carry:1,move:4,work:6});
		} else if(energy >= 600) {
			body = this.buildBody({carry:1,work:5,move:1});
		} else {
			body = this.buildBody({work:5,move:1});
		}
		bodyset = true;
		creepMem.combat = true;
	}
	else if (roleName == "killdozer") {
		if(energy >= 7650 ) {
			bodyset = true;
			body = this.buildBody({move:16,work:6,heal:25});
			creepMem.needsBoosted = true;
		}
	}
	else if (roleName == "healer") {
		if(energy >= 10500) {
			body = this.buildBody({move:10,heal:40});
		} else if(energy >= 7500) {
			body = this.buildBody({move:25,heal:25});
		} else if(energy >= 4500) {
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
		creepMem.needsBoosted = true;
	}
	else if (roleName == "claimer") {
		if(energy >= 2600) {
			body = this.buildBody({claim:4,move:4});
		} else if (energy >= 1300) {
			body = this.buildBody({claim:2,move:2});
		} else if (energy >= 650) {
			body = this.buildBody({claim:1,move:1});
		}
		bodyset = true;
	}
	else if(roleName == "actualclaimer") {
		body = this.buildBody({claim:1,move:1})
		bodyset = true;
	}
	else if(roleName == "unclaimer") {
                body = this.buildBody({claim:15,move:15})
                bodyset = true;
	}
	else if (roleName == "remoteupgrader") {
		if(energy >= 2000) {
			body = this.buildBody({work:10,carry:10,move:10});
			bodyset = true;	
		}
	}
        else if (roleName == "remoteharvester") {
		body = this.buildBody({work:2,carry:9,move:11});
                bodyset = true;
        }
	else if ((roleName == "harvester" && energy >= 500) || roleName == "gc" || roleName == "upgradertinder" || roleName == "rupgradertinder") {
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
	else if (roleName == "feeder") {
		let feedbody = {carry:0,move:0};
		let energyLeft = energy;
		let Nparts = 0;
                while(energyLeft > 0 && Nparts < 50) {
                        energyLeft -= 50;
                        Nparts++;
                        if(energyLeft < 0 || Nparts > 50) break;
                        feedbody.move++;

                        energyLeft -= 50;
                        Nparts++;
                        if(energyLeft < 0 || Nparts > 50) break;
                        feedbody.carry++;

                        energyLeft -= 50;
                        Nparts++;
                        if(energyLeft < 0 || Nparts > 50) break;
                        feedbody.carry++;
                }
		body = this.buildBody(feedbody);
		bodyset = true;
	}
	else if (roleName == "fetcher" || roleName == "remotefetcher" || roleName == "lgfetcher" || roleName == "mmfetcher" || roleName == "rmmfetcher") {
		let fetchbody = {};
		if(energy >= 2450) {
			fetchbody = {carry:31,work:1,move:16};
			if(energy >= 2600) {
				fetchbody.work++;
				fetchbody.move++;
			}
		}
		else if(energy >= 1550) {
			fetchbody = {carry:19,work:1,move:10};
		}
		else if(energy >= 950) {
			fetchbody = {carry:11,work:1,move:6};
		}
		else if(energy >= 900) {
			fetchbody = {carry:12,move:6};
		}
		else if(energy >= 450) {
			fetchbody = {carry:6,move:3};
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
		creepMem.combat = true
		bodyset = true;
        } else if (roleName == "linktender") {
		if(energy >= 1400) {
			ltbody = {move:1, carry:16};
		} else {
			ltbody = {move:1, carry:8};
		}
		body = this.buildBody(ltbody);
		bodyset = true;
	} else if (roleName == "mineralminer" || roleName == "rmineralminer") {
		bodyset = true;
		if(energy >= 4500) {
			body = this.buildBody({work:40,carry:1,move:9});
		} else if(energy >= 2600) {
			body = this.buildBody({work:25,carry:1,move:1});
		} else if (energy >= 2100) {
			body = this.buildBody({work:20,carry:1,move:1});
		} else if (energy >= 1300) {
			body = this.buildBody({work:10,carry:1,move:5});
		} else {
			bodyset = false;
		}
	} else if (roleName == "repairer") {
		creepMem.needsBoosted = true;
		if(energy >= 3650) {
			body = this.buildBody({work:23,carry:10,move:17});
			bodyset = true;
		}
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

	if(body.length == 0) return -6;

            // create creep with the created body and the given role
	    let checkResult = this.canCreateCreep(body, name);
	    
	    if(checkResult == 0) {
	            checkResult =  this.createCreep(body, name, creepMem);
	    }
	    if(checkResult < 0) {
		message = "[" + this.name + "(" + roomLink(this.room.name, false) + ")]  tried to spawn " + name + " but received error: ";
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
				if(name < 0) {
					name = undefined;
				}
				let roleMem = roomroles[roleM];
				let role = roles[roleM];
				if(roleM == "undefined" || roleMem == undefined) continue;
				let minimum = needed.getNeeded(role.namer,mySpawn.room.name);
				let requirement = needed.getEnergy(role.namer,mySpawn.room.name);
				var route = "NONE";
				if(minimum > roleMem.current) {
					Memory.rooms[mySpawn.room.name].goingToSpawn.push(role.namer);
					if((role.buildRestriction == true && dontBuild == true) || (Memory.rooms[mySpawn.room.name].bootstraping == true && role.namer != "harvester")) {
						route = "BOOTSTRAPPING";
						continue;
					}
					if(requirement > 0 && myActualEnergy >= requirement) {
						route = "REQUIREMENT>0";
						name = mySpawn.createCustomCreep(requirement, role.namer);
					}
					else if(requirement == -1 && readyToMaxSpawn) {
						route = "REQUIREMENT-1";
						name = mySpawn.createCustomCreep(myActualEnergy, role.namer);
					}
					else if(requirement == 0 && readyToSpawn) {
						route = "REQUIREMENT0";
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
					console.log("[" + mySpawn.name + "] Tried to spawn a " + role.namer + " but got error " + name + " (Required: " + minimum + " / Current: " + roleMem.current + ") Route: "+ route);
				}
			}
		}
		if (!(name < 0) && name != undefined) {
			console.log("[" + mySpawn.name + "(" + roomLink(this.room.name, false) + ")] Spawned new creep: " + name + " (" + Memory.creeps[name].role + ")");
		}
	}
};
