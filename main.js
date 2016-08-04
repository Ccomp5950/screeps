// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
require('prototype.flag')();
require('functions');
var roles =            {harvester:      {namer:"harvester",             minimum:2,      requirement:0,          buildRestriction : false,       run: require('role.harvester')},
                        miner:          {namer:"miner",                 minimum:2,      requirement:900,        buildRestriction : true,        run: require('role.miner')},
                        fetcher:        {namer:"fetcher",               minimum:2,      requirement:1400,       buildRestriction : true,        run: require('role.fetcher')},
                        upgrader:       {namer:"upgrader",              minimum:1,      requirement:-1,         buildRestriction : true,        run: require('role.upgrader')},
                        builder:        {namer:"builder",               minimum:0,      requirement:0,          buildRestriction : true,        run: require('role.builder')},
                        repairer:       {namer:"repairer",              minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.repairer')},
                        wallrepairer:   {namer:"wallrepairer",          minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.wallRepairer')},
                        towertender:    {namer:"towertender",           minimum:0,      requirement:0,          buildRestriction : false,       run: require('role.towertender')},
                        scout:          {namer:"scout",                 minimum:0,      requirement:200,        buildRestriction : true,        run: require('role.scout')},
                        attacker:       {namer:"attacker",              minimum:0,      requirement:800,        buildRestriction : false,       run: require('role.attacker')},
                        defender:       {namer:"defender",              minimum:0,      requirement:800,        buildRestriction : false,       run: require('role.defender')},
                        raider:         {namer:"raider",                minimum:0,      requirement:800,        buildRestriction : false,       run: require('role.raider')},
                        claimer:        {namer:"claimer",               minimum:0,      requirement:1400,       buildRestriction : true,        run: require('role.claimer')}
                        };

module.exports.loop = function () {

    // check for memory entries of died creeps by iterating over Memory.creeps

    for(let role in roles) {
	roles[role].current = 0;
    } 

    noMoreConstruction = false;

    let timeout = 500;
    if(Memory.constructionSpam != null) {
	
	timeout = Memory.constructionSpam;
    }
 	/*
    if(Game.constructionSites != null) {
	let total = 0;
	for(let i in Game.constructionSites) {
		Game.constructionSites[i].remove();
		total++;
	}
	if(total > 99) {
		noMoreConstruction = true;
	}
	console.log("Current ConstructionSite Count: " + total);
    }
	*/
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
    redAlert = false;
    underAttack[room] = false;
    worstThreat = null;
    worstThreatRating = -2;
    biggestThreat[room] = null;
    biggestThreatRating[room] = -2;
    if(meaniesA[room] != undefined && meaniesA[room].length > 0) {
	redAlert = true;
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
	console.log("[" + room + "]OH FUCK " + meaniesA[room].length + " creeps from an asshole named " + meaniename + " Biggest Threat: " + biggestThreatRating[room]);
	}
    }
    


    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
		let flag = ""
		if(Memory.creeps[name].myFlag != null) {
			flag = "(" + Memory.creeps[name].myFlag + ")";
		}
		console.log("RIP: " + name + " the " +Memory.creeps[name].role + " " + flag);
            delete Memory.creeps[name];
        }
    }
    for (let name in Memory.flags) {
        if (Game.flags[name] == undefined) {
                console.log("Removed " + name+ " from flag list");
            delete Memory.flags[name];
        }
    }

    for (let name in Game.flags) {
		if(Game.flags[name].memory == null)
			Memory.flags[name].lala = -1;
	}

    // for every creep name in Game.creeps

	
    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];

	if((underAttack[creep.room.name] && creep.memory.role != "defender" && creep.memory.role != "miner" && creep.memory.role != "attacker") || creep.memory.role == 'towertender') {
		roles["towertender"].current++;
		roles["towertender"].run.run(creep);
	}
        else if (creep.memory.setupTime != null) {
	    if(creep.checkTimeToReplace() == false) {
		roles[creep.memory.role].current++;
	    }
	    roles[creep.memory.role].run.run(creep);
        } 
        else {
		if(roles[creep.memory.role] == null) {
			console.log("Warning: " + name + " has a bad role: " + creep.memory.role);
		} else {
			if((creep.ticksToLive - (creep.body.length * 2) - 2) >= 0) {
				roles[creep.memory.role].current++;
			}
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

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var mySpawn = Game.spawns.Spawn1;
    var myActualEnergy = mySpawn.room.energyAvailable;
    var energyCap = mySpawn.room.energyCapacityAvailable;
    var energyMax = 1200;
    var myEnergy = Math.min(energyMax, myActualEnergy);
    var name = undefined;
    var job = null;
    var readyToSpawn = false;
    var readyToMaxSpawn = false;

   
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





	if(Game.creeps.length == 0) {
		name = mySpawn.createCustomCreep(myEnergy, 'harvester');
	} else {

	for(let roleM in roles) {
		let role = roles[roleM];
		if(role.minimum > role.current) {
			if(role.buildRestriction == true && dontBuild == true || role.minimum == 0) {
				continue;
			}
			if(role.requirement > 0 && myActualEnergy >= role.requirement && mySpawn.spawning == null) {
				name = mySpawn.createCustomCreep(role.requirement, role.namer);
			}
			else if(role.requirement == -1 && readyToMaxSpawn) {
				name = mySpawn.createCustomCreep(myActualEnergy, role.namer);
			}
			else if(role.requirement == 0 && readyToSpawn) {
				name = mySpawn.createCustomCreep(myEnergy, role.namer);
			}
		}
		if(!(name < 0) && name != undefined) {
			break;
		} else if(name < 0) { 
			console.log("Tried to spawn a " + role.namer + " but got error " + name);
		}
	}


	}
	


    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name );
    }
};
