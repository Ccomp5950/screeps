// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleTowerTender = require('role.towertender');
var roleScout = require('role.scout');
var roleAttacker = require('role.attacker');
var roleDefender = require('role.defender');
var roleRemoteHarvester = require('role.remoteharvester');
var roleMiner = require('role.miner');
var roleFetcher = require('role.fetcher');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps

 
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
			var creepThreat = enemy_creep.getthreat();
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

    var numberOfHarvesters = 0;
    var numberOfMiners = 0;
    var numberOfFetchers = 0;
    var numberOfUpgraders = 0;
    var numberOfBuilders = 0;
    var numberOfRepairers = 0;
    var numberOfWallRepairers = 0;
    var numberOfTowerTenders = 0;
    var numberOfScouts = 0;
    var numberOfAttackers = 0;
    var numberOfDefenders = 0;
    var numberofRemoteHarvesters = 0;

    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

	if((underAttack[creep.room.name] && creep.memory.role != "defender" && creep.memory.role != "miner") || creep.memory.role == 'towertender') {
		numberOfTowerTenders++;
		roleTowerTender.run(creep);
	}
	

        // if creep is harvester, call harvester script
        else if (creep.memory.role == 'harvester') {
	    numberOfHarvesters++;
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'miner') {
	    let adjustment = 0;
	    if(creep.nameIsEven == true) {
		adjustment -= 35;
            } else {
		adjustment += 45;		
	    }
	    if(creep.ticksToLive > Memory.lifeTimeOfMiners + adjustment) {
	            numberOfMiners++;
	    }
            roleMiner.run(creep);
        }
        else if (creep.memory.role == 'fetcher') {
            numberOfFetchers++;
            roleFetcher.run(creep);
        }

        else if (creep.memory.role == 'defender') {
            numberOfDefenders++;
            roleDefender.run(creep);
        }

        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            numberOfUpgraders++;
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            numberOfBuilders++;
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            numberOfRepairers++;
            roleRepairer.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            numberOfWallRepairers++
            roleWallRepairer.run(creep);
        }
	else if (creep.memory.role == 'scout') {
	    numberOfScouts++;
            roleScout.run(creep);
	}
        else if (creep.memory.role == 'attacker') {
            numberOfAttackers++;
            roleAttacker.run(creep);
        }
        else if (creep.memory.role == 'remoteharvester') {
	    numberofRemoteHarvesters++;
            roleRemoteHarvester.run(creep);
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

    // setup some minimum numbers for different roles
    var spawnInfinite = false;
    var minimumNumberOfHarvesters = 2;
    var minimumNumberOfMiners = 2;
    var minimumNumberOfFetchers = 2;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfTowerTenders = 0;
    var minimumNumberOfScouts = 0;
    var minimumNumberOfAttackers = 0;
    var minimumNumberOfDefenders = 1;
    var minimumNumberOfRemoteHarvesters = 6;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var energyMax = 1000;
    var myEnergy = Math.min(energyMax, Game.spawns.Spawn1.room.energyAvailable);
    var name = undefined;
    var job = null;
    var readyToSpawn = false;

    if(myEnergy == energyMax || Math.floor(energy / 200) == Math.floor(myEnergy/200)) {
	readyToSpawn = true;
    }

    if(Game.spawns.Spawn1.spawning) {
	readyToSpawn = false;
    }
    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        // try to spawn one
        if(readyToSpawn) {
		name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'harvester');
		if(name != ERR_NOT_ENOUGH_ENERGY) {
			numberOfHarvesters++;
		}
	}

        // if spawning failed and we have no harvesters left
        if (numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createCustomCreep(
                myEnergy, 'harvester');
        }
    }
    else if (myEnergy >= 900 && numberOfMiners < minimumNumberOfMiners) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'miner');	
    }
    else if (myEnergy >= 800 && numberOfFetchers < minimumNumberOfFetchers) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'fetcher');
    }
    // if not enough upgraders
    else if (readyToSpawn && numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'upgrader');
    }
    else if (readyToSpawn && numberOfRepairers < minimumNumberOfRepairers) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'repairer');
    }
    else if (myEnergy >= 800 && numberOfDefenders < minimumNumberOfDefenders) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'defender');
    }
    else if (readyToSpawn && numberofRemoteHarvesters < minimumNumberOfRemoteHarvesters) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'remoteharvester');
        }
    else if (readyToSpawn && numberOfBuilders < minimumNumberOfBuilders) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'builder');
    }
    else if (readyToSpawn && numberOfWallRepairers < minimumNumberOfWallRepairers) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'wallRepairer');
    }
    else if (readyToSpawn && numberOfTowerTenders < minimumNumberOfTowerTenders) {
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'towertender');
    }
    else if (myEnergy >= 200 && numberOfScouts < minimumNumberOfScouts) {
	name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'scout');
    }
    else if (myEnergy >= 800 && numberOfAttackers < minimumNumberOfAttackers) {
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'attacker');
    }
    else if (readyToSpawn && spawnInfinite) {
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'builder');
    }
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name );
    }
};
