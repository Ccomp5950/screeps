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

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    if(Memory.wallMinHealth == undefined) {
	Memory.wallMinHealth = 3000000;
    }
    validSources = [];
    var meaniesA = [];
    for(let room of Memory.myrooms) {
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
    var underAttack = [];;
    var biggestThreat = [];
    var biggestThreatRating = [];
    for(let room of Memory.myrooms) {
    underAttack[room] = false;
    biggestThreat[room] = null;
    biggestThreatRating[room] = -2;
    if(meaniesA[room].length > 0) {

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
    var numberOfUpgraders = 0;
    var numberOfBuilders = 0;
    var numberOfRepairers = 0;
    var numberOfWallRepairers = 0;
    var numberOfTowerTenders = 0;
    var numberOfScouts = 0;
    var numberOfAttackers = 0;
    var numberOfDefenders = 0;

    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

	if((underAttack[creep.room.name] && creep.memory.role != "defender") || creep.memory.role == 'towertender') {
		numberOfTowerTenders++;
		roleTowerTender.run(creep);
	}
	

        // if creep is harvester, call harvester script
        else if (creep.memory.role == 'harvester') {
	    numberOfHarvesters++;
            roleHarvester.run(creep);
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

    }

	for(let room of Memory.myrooms) {
		var towers = Game.rooms[room].find(FIND_STRUCTURES, {
                                               filter: (s) => s.structureType == STRUCTURE_TOWER
                                               });
		if(underAttack[room]) {
			for (let tower of towers) {
				tower.attack(biggestThreat[room]);	
			}
		} else {
			let structure = Game.rooms[room].findClosestByRange(FIND_STRUCTURES, {
									filter: (s) => s.hits < 101
                        });
			if(structure != undefined) {
				for (let tower of towers) {
					tower.repair(structure);
				}
			}
		}
		
	}

   

    // setup some minimum numbers for different roles
    var spawnInfinite = false;
    var minimumNumberOfHarvesters = 3;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfTowerTenders = 0;
    var minimumNumberOfScouts = 0;
    var minimumNumberOfAttackers = 0;
    var minimumNumberOfDefenders = 1;

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
	job = "Harvester";
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
    // if not enough upgraders
    else if (readyToSpawn && numberOfUpgraders < minimumNumberOfUpgraders) {
	job = "Upgrader";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'upgrader');
    }
    // if not enough repairers
    else if (readyToSpawn && numberOfRepairers < minimumNumberOfRepairers) {
	job = "Repairer";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'repairer');
    }
    else if (myEnergy >= 800 && numberOfDefenders < minimumNumberOfDefenders) {
        job = "Defender";
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'defender');
    }

    // if not enough builders
    else if (readyToSpawn && numberOfBuilders < minimumNumberOfBuilders) {
	job = "Builder";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'builder');
    }
    // if not enough wallRepairers
    else if (readyToSpawn && numberOfWallRepairers < minimumNumberOfWallRepairers) {
	job = "Wall Repairer";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'wallRepairer');
    }
    else if (readyToSpawn && numberOfTowerTenders < minimumNumberOfTowerTenders) {
        job = "Tower Tender";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'towertender');
    }
    else if (myEnergy >= 200 && numberOfScouts < minimumNumberOfScouts) {
	job = "Scout";
	name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'scout');
    }
    else if (myEnergy >= 800 && numberOfAttackers < minimumNumberOfAttackers) {
        job = "Attacker";
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'attacker');
    }
    else if (readyToSpawn && spawnInfinite) {
	job = "Builder";
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCustomCreep(myEnergy, 'builder');
    }
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name + " the " + job);
    }
};
