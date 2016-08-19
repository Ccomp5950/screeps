// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
require('prototype.structure')();
require('prototype.flag')();
require('prototype.link')();
require('functions');
//require('role');
var memorymgmt = require('memorymgmt');
var needed = require('getNeeded');
									//DEFAULTS  ONLY  CHANGE IN MEMORY
var roles =            {harvester:      {namer:"harvester",             minimum:2,      requirement:0,          buildRestriction : false,       run: require('role.harvester')},
			attacker:       {namer:"attacker",              minimum:1,      requirement:800,        buildRestriction : false,       run: require('role.attacker')},
			sapper:         {namer:"sapper",                minimum:1,      requirement:-1,         buildRestriction : true,        run: require('role.sapper')},
                        towerdrainer:   {namer:"towerdrainer",          minimum:0,      requirement:2300,       buildRestriction : true,        run: require('role.towerdrainer')},
                        healer:         {namer:"healer",                minimum:0,      requirement:1500,       buildRestriction : true,        run: require('role.healer')},
			linktender:     {namer:"linktender",            minimum:0,      requirement:1400,       buildRestriction : false,       run: require('role.linktender')},
                        miner:          {namer:"miner",                 minimum:4,      requirement:900,        buildRestriction : true,        run: require('role.miner'), spawn: "Spawn1"},
                        fetcher:        {namer:"fetcher",               minimum:4,      requirement:1800,       buildRestriction : true,        run: require('role.fetcher')},
			mineralminer:   {namer:"mineralminer",		minimum:1,	requirement:1000,	buildRestriction : true,	run: require('role.mineralminer')},
			remotebuilder:	{namer:"remotebuilder",         minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.remotebuilder')},
                        upgrader:       {namer:"upgrader",              minimum:1,      requirement:1100,       buildRestriction : true,        run: require('role.upgrader'), spawn: "Spawn1"},
			upgradertinder:	{namer:"upgradertinder",	minimum:1,	requirement:1800,	buildRestriction : true,        run: require('role.upgradertinder')},
			remoteupgrader: {namer:"remoteupgrader",	minimum:0,	requirement:1550,	buildRestriction : true,	run: require('role.remoteupgrader')},
                        builder:        {namer:"builder",               minimum:0,      requirement:0,          buildRestriction : true,        run: require('role.builder')},
                        repairer:       {namer:"repairer",              minimum:0,      requirement:0,          buildRestriction : true,        run: require('role.repairer')},
                        wallrepairer:   {namer:"wallrepairer",          minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.wallRepairer')},
                        towertender:    {namer:"towertender",           minimum:0,      requirement:0,          buildRestriction : false,       run: require('role.towertender')},
                        scout:          {namer:"scout",                 minimum:1,      requirement:50,		buildRestriction : true,        run: require('role.scout')},
                        defender:       {namer:"defender",              minimum:1,      requirement:-1,		buildRestriction : false,       run: require('role.defender')},
                        raider:         {namer:"raider",                minimum:0,      requirement:800,        buildRestriction : false,       run: require('role.raider')},
                        claimer:        {namer:"claimer",               minimum:1,      requirement:1400,       buildRestriction : true,        run: require('role.claimer')},
			gc:		{namer:"gc",			minimum:0,      requirement:2800,       buildRestriction : true,        run: require('role.garbagecollector')},
			actualclaimer:  {namer:"actualclaimer",		minimum:0,      requirement:650,        buildRestriction : true,        run: require('role.actualclaimer')}
                        };

module.exports.loop = function () {
    memorymgmt.master();
    // check for memory entries of died creeps by iterating over Memory.creeps
    distCheck();
    handleLinks();


    let totalRoles = 0;
    for(let roleM in roles) {
	let role = roles[roleM];
	if(Memory.roles == null) {
		Memory.roles = {};
	}
	if(Memory.roles[roleM] == null) {
		Memory.roles[roleM] = {minimum: role.minimum, requirement: role.requirement};
	}
	role.minimum = needed.getNeeded(role.namer);
	role.requirement = Memory.roles[roleM].requirement;
	if(role.namer == "builder" && _.size(Game.constructionSites) == 0) {
		role.minimum = 0;
	}
	totalRoles++;
	role.current = 0;
    } 
    if(Memory.totalRoles != totalRoles) {
	Memory.totalRoles = totalRoles;
    }
    noMoreConstruction = false;

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
		meaniesA[room] = Game.rooms[room].find(FIND_HOSTILE_CREEPS, {
				filter: (c) => c.checkIfAlly() == false
		});
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
    

    var numberOfCreeps = _.size(Memory.creeps);

    for (let name in Game.creeps) {
        // get the creep object
        var creep = Game.creeps[name];
	creep.memory.ticksToLive = creep.ticksToLive;
	creep.memory.currentRoom = creep.room.name;
	creep.memory.currentHits = creep.hits;
	creep.memory.currentMaxHits = creep.hitsMax;
	if(creep.ticksToLive == undefined) {
		// Spawning
		roles[creep.memory.role].current++;
		roles[creep.memory.role].run.run(creep);
		continue;
	}
	if((underAttack[creep.room.name] && !creep.memory.combat && creep.memory.role != "miner" && creep.memory.role != "upgrader") || creep.memory.role == 'towertender') {
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
			if((creep.ticksToLive - (creep.body.length * 3)) >= 0) {
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
	                                                                        filter: (s) => s.hits != s.hitsMax && s.hits < 1001
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
    if(mySpawn.spawning != null) {
	mySpawn = Game.spawns.Spawn2;
    }
    var myActualEnergy = mySpawn.room.energyAvailable;
    var energyCap = mySpawn.room.energyCapacityAvailable;
    var energyMax = 1600;
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


	if(numberOfCreeps == 0) {
		Memory.bootstraping = true;
	}
	


	if(roles["harvester"].current == 0) {
		name = mySpawn.createCustomCreep(myEnergy, 'harvester');
	} else {
	let totalRoles = 0;
	Memory.goingToSpawn = [];
	for(let roleM in roles) {
		let role = roles[roleM];
		if(role.minimum > role.current) {
			Memory.goingToSpawn.push(role.namer);
			if((role.buildRestriction == true && dontBuild == true) || (Memory.bootstraping == true && role.namer != "harvester")) {
				continue;
			}
			if(role.spawn != undefined && mySpawn.name != role.spawn) {
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
			else if(role.namer == "harvester") {
			break;
			}
		} else if (role.namer == "harvester") {
			Memory.bootstraping = false;
		}
		if(!(name < 0) && name != undefined) {
			break;
		} else if(name < 0) { 
			console.log("Tried to spawn a " + role.namer + " but got error " + name);
		}
	}

	}
	


    if (!(name < 0) && name != undefined) {
        console.log("[" + mySpawn.name + "] Spawned new creep: " + name );
    }
};
