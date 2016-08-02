// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps

var roles =            {harvester:      {name:"harvester",              minimum:2,      requirement:0,          run: require('role.harvester')},
                        miner:          {name:"miner",                  minimum:2,      requirement:900,        run: require('role.miner')},
                        fetcher:        {name:"fetcher",                minimum:2,      requirement:850,        run: require('role.fetcher')},
                        upgrader:       {name:"upgrader",               minimum:1,      requirement:0,          run: require('role.upgrader')},
                        builder:        {name:"builder",                minimum:1,      requirement:0,          run: require('role.builder')},
                        repairer:       {name:"repairer",               minimum:1,      requirement:0,          run: require('role.repairer')},
                        wallrepairer:   {name:"wallrepairer",           minimum:1,      requirement:0,          run: require('role.wallRepairer')},
                        towertender:    {name:"towertender",            minimum:0,      requirement:0,          run: require('role.towertender')},
                        scout:          {name:"scout",                  minimum:0,      requirement:200,        run: require('role.scout')},
                        attacker:       {name:"attacker",               minimum:0,      requirement:800,        run: require('role.attacker')},
                        defender:       {name:"defender",               minimum:1,      requirement:800,        run: require('role.defender')},
                        raider:         {name:"raider",                 minimum:0,      requirement:800,        run: require('role.raider')},
                        remoteharvester:{name:"remoteharvester",        minimum:6,      requirement:1000,       run: require('role.remoteharvester')}
                        };





    for(let role in roles) {
	role.current = 0;
    } 
    validSources = [];
    var meaniesA = [];

    for(let room of Memory.myrooms) {
	if(Game.rooms[room] != undefined) {
		let sourcesA = Game.rooms[room].find(FIND_SOURCES);
		validSources[room] = [];
		for(let sourceM of sourcesA) {
			if(sourceM.energy > 2 && sourceM.isFree()) {
				validSources[room].push(sourceM);
			}
		}
	        meaniesA[room] = [];
		meaniesA[room] = Game.rooms[room].find(FIND_HOSTILE_CREEPS);
	}
    }

    
    var spawnInfinite = false;
    var dontBuild = false;
    var underAttack = [];
    var biggestThreat = [];
    var biggestThreatRating = [];
    for(let room of Memory.myrooms) {
    underAttack[room] = false;
    biggestThreat[room] = null;
    biggestThreatRating[room] = -2;
    if(meaniesA[room] != undefined && meaniesA[room].length > 0) {
	dontBuild = true;
	underAttack[room] = true;
	var meaniename = "";
	for (let enemy_creep of meaniesA[room]) {
		
		if(enemy_creep.body != undefined) {
			var creepThreat = enemy_creep.getThreat();
			if(biggestThreatRating[room] < creepThreat) {
				biggestThreat[room] = enemy_creep;
				biggestThreatRating[room] = creepThreat;
			}
		} else {
			biggestThreat[room] = enemy_creep;
			biggestThreatRating[room] = 1;
		}
		
		if(enemy_creep.owner != undefined) {
		meaniename = "from " + enemy_creep.owner.username;
		}
	}
	console.log("[" + room + "]OH FUCK " + meaniesA[room].length + meaniename + "Biggest Threat: " + biggestThreatRating[room]);
	}
    }


    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
		console.log("RIP: " + name + " the " +Memory.creeps[name].role);
            delete Memory.creeps[name];
        }
    }

    // for every creep name in Game.creeps

	
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

	if((underAttack[creep.room.name] && creep.memory.role != "defender" && creep.memory.role != "miner" && creep.memory.role != "attacker") || creep.memory.role == 'towertender') {
		roles["towertender"].current++;
		roles["towertender"].run.run(creep);
	}
        else if (creep.memory.role == 'miner') {
	    let adjustment = 0;
	    if(creep.nameIsEven == true) {
		adjustment -= 35;
            } else {
		adjustment += 45;		
	    }
	    if(creep.ticksToLive > Memory.lifeTimeOfMiners + adjustment) {
		roles["miner"].current++;
	    }
	    roles["miner"].run.run(creep);
        }
        else {
		if(roles[creep.memory.role] == null) {
			console.log("Warning: " + name + " has a bad role: " + creep.memory.role);
		} else {
			roles[creep.memory.role].current++;
			roles[creep.memory.role].run.run(creep);
		}
	}
    }

	for(let room of Memory.myrooms) {
		if(Game.rooms[room] != undefined) {
			var towers = Game.rooms[room].find(FIND_STRUCTURES, {
	                                               filter: (s) => s.structureType == STRUCTURE_TOWER
	                                               });
			if(underAttack[room]) {
				for (let tower of towers) {
					tower.attack(biggestThreat[room]);	
				}
			} else {
				for (let tower of towers) {
		                        let structure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
	                                                                        filter: (s) => s.hits < 1001
		                        });
					if(structure != undefined) {
						tower.repair(structure);
					}
				}
			}
		}
		
	}

	if(dontBuild == true) {
		return;
	}   

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var mySpawn = Game.spawns.Spawn1;
    var myActualEnergy = mySpawn.room.energyAvailable;
    var energy = mySpawn.room.energyCapacityAvailable;
    var energyMax = 1000;
    var myEnergy = Math.min(energyMax, myActualEnergy);
    var name = undefined;
    var job = null;
    var readyToSpawn = false;

    if(myEnergy == energyMax || Math.floor(energy / 200) == Math.floor(myEnergy/200)) {
	readyToSpawn = true;
    }

    if(mySpawn.spawning) {
	readyToSpawn = false;
    }





	if(Game.creeps.length == 0) {
		name = mySpawn.createCustomCreep(myEnergy, 'harvester');
	} else {

	for(let role in roles) {
		console.log("In Role loop: " + role.name);
		if(role.minimum > role.current) {
			console.log("Need to spawn");
			if(role.requirement > 0 && myActualEnergy > role.requirement) {
				name = mySpawn.Spawn1.createCustomCreep(myActualEnergy, role.name);
			}
			else if(readyToSpawn) {
				name = mySpawn.Spawn1.createCustomCreep(myEnergy, role.name);
			}
		}
		if(!(name < 0) && name != undefined) {
			break;
		}
	}


	}
	


    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name );
    }
};
