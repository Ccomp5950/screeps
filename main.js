//
// import modules
require('prototype.spawn')();
require('prototype.creep')();
require('prototype.source')();
require('prototype.structure')();
require('prototype.flag')();
require('prototype.link')();
require('prototype.room')();
require('prototype.roomobject')();
const profiler = require('screeps-profiler');
//profiler.enable();
require('functions');
//require('role');
var memorymgmt = require('memorymgmt');
var needed = require('getNeeded');
									//DEFAULTS  ONLY  CHANGE IN MEMORY
var roles =            {harvester:      {namer:"harvester",             minimum:2,      requirement:0,          buildRestriction : false,       run: require('role.harvester')},
			linktender:     {namer:"linktender",            minimum:0,      requirement:1400,       buildRestriction : false,       run: require('role.linktender')},
			attacker:       {namer:"attacker",              minimum:1,      requirement:800,        buildRestriction : false,       run: require('role.attacker')},
			sapper:         {namer:"sapper",                minimum:1,      requirement:-1,         buildRestriction : true,        run: require('role.sapper')},
                        towerdrainer:   {namer:"towerdrainer",          minimum:0,      requirement:2300,       buildRestriction : true,        run: require('role.towerdrainer')},
                        healer:         {namer:"healer",                minimum:0,      requirement:1500,       buildRestriction : true,        run: require('role.healer')},
			defender:       {namer:"defender",              minimum:1,      requirement:-1,         buildRestriction : false,       run: require('role.defender')},
                        miner:          {namer:"miner",                 minimum:4,      requirement:900,        buildRestriction : true,        run: require('role.miner')},
                        fetcher:        {namer:"fetcher",               minimum:4,      requirement:1800,       buildRestriction : true,        run: require('role.fetcher')},
			lgfetcher:      {namer:"lgfetcher",             minimum:4,      requirement:1800,       buildRestriction : true,        run: require('role.fetcher')},
			mineralminer:   {namer:"mineralminer",		minimum:1,	requirement:1000,	buildRestriction : true,	run: require('role.mineralminer')},
			remotebuilder:	{namer:"remotebuilder",         minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.remotebuilder')},
                        upgrader:       {namer:"upgrader",              minimum:1,      requirement:1100,       buildRestriction : true,        run: require('role.upgrader')},
			upgradertinder:	{namer:"upgradertinder",	minimum:1,	requirement:1800,	buildRestriction : true,        run: require('role.upgradertinder')},
			remoteupgrader: {namer:"remoteupgrader",	minimum:0,	requirement:1550,	buildRestriction : true,	run: require('role.remoteupgrader')},
			labtender:	{namer:"labtender",		minimum:0,      requirement:450,        buildRestriction : true,        run: require('role.labtender')},
			groundskeeper:	{namer:"groundskeeper",		minimum:0,	requirement:2000,	buildRestriction : true,	run: require('role.groundskeeper')},
                        builder:        {namer:"builder",               minimum:0,      requirement:0,          buildRestriction : true,        run: require('role.builder')},
                        repairer:       {namer:"repairer",              minimum:0,      requirement:0,          buildRestriction : true,        run: require('role.repairer')},
                        wallrepairer:   {namer:"wallrepairer",          minimum:1,      requirement:0,          buildRestriction : true,        run: require('role.wallRepairer')},
                        towertender:    {namer:"towertender",           minimum:0,      requirement:0,          buildRestriction : false,       run: require('role.towertender')},
                        scout:          {namer:"scout",                 minimum:1,      requirement:50,		buildRestriction : true,        run: require('role.scout')},
                        raider:         {namer:"raider",                minimum:0,      requirement:800,        buildRestriction : false,       run: require('role.raider')},
                        claimer:        {namer:"claimer",               minimum:1,      requirement:1400,       buildRestriction : true,        run: require('role.claimer')},
			unclaimer:      {namer:"unclaimer",             minimum:0,      requirement:3250,       buildRestriction : true,        run: require('role.unclaimer')},
			gc:		{namer:"gc",			minimum:0,      requirement:2800,       buildRestriction : true,        run: require('role.garbagecollector')},
			actualclaimer:  {namer:"actualclaimer",		minimum:0,      requirement:650,        buildRestriction : true,        run: require('role.actualclaimer')},
			feeder:		{namer:"feeder",		minimum:0,	requirement:1100,	buildRestriction : true,	run: require('role.feeder')}
                        };

module.exports.loop = function () {
	profiler.wrap(function() {
	require('stats');
	memorymgmt.master();
	if(Game.time % 5 == 0) memorymgmt.newRoles(roles);
	// check for memory entries of died creeps by iterating over Memory.creeps
	distCheck();
	handleLinks();
	handleLabs();
	if(Memory.cpuwarning > 0) Memory.cpuwarning--;
	if(Memory.cpuwarning == 0) { 
		if(Game.cpu.bucket < 9750 && Game.cpu.bucket < Memory.lastBucket) {
			Memory.cpuwarning = 10;
			console.log("[" + Game.time + "] <span style='color: red;'>CPU Bucket:" +Game.cpu.bucket.toLocaleString() + "/10,000 </span>");
		}
		Memory.lastBucket = Game.cpu.bucket;
	}


	noMoreConstruction = false;
	validSources = [];
	var meaniesA = [];
	let totalstorage = 0;
	for(let room in Memory.rooms) {
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
		Memory.rooms[room].totalCreeps = 0;
		if(Game.time % 100 == 0) {
			if(Game.rooms[room] != undefined 
			&& Game.rooms[room].controller != undefined
			&& Game.rooms[room].controller.progress != undefined 
			&& Game.rooms[room].controller.level != 8) 
			{
				let progressleft = Game.rooms[room].controller.progressTotal - Game.rooms[room].controller.progress;
				let level = Game.rooms[room].controller.level + 1;
				let percent = Math.floor((Game.rooms[room].controller.progress / Game.rooms[room].controller.progressTotal) * 100);
				let storage = "";
				if(Game.rooms[room].storage != undefined) {
					totalstorage += Game.rooms[room].storage.store.energy;
					storage = "[Storage: " + Game.rooms[room].storage.store.energy.toLocaleString() + " energy]";
				}
				console.log("[" + room + "]<span style='color: yellow;'> Progress Left until RCL" + level + " : " + progressleft.toLocaleString() + " / " + percent + "%   "+ storage + "</span>");
			}
		}
	}
	if(Game.time % 100 == 0) {
		console.log("[" + Game.time + "] <span style='color: yellow;'>Total Storage: " + totalstorage.toLocaleString() + "</span>");
	}

    
	var spawnInfinite = false;
	var dontBuild = false;
	var underAttack = [];
	var biggestThreat = [];
	var biggestThreatRating = [];
	for(let room in Memory.rooms) {
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
		Memory.rooms[creep.memory.spawnRoom].totalCreeps++;
		creep.memory.ticksToLive = creep.ticksToLive;
		creep.memory.currentRoom = creep.room.name;
		creep.memory.currentHits = creep.hits;
		creep.memory.currentMaxHits = creep.hitsMax;
		if(Memory.rooms[creep.memory.spawnRoom].role == undefined) {
			console.log("[" + creep.name + "] My spawn room has no memory");
			continue;
		}
		if(Memory.rooms[creep.memory.spawnRoom].role[creep.memory.role] == undefined) {
			console.log("[" + creep.name + "] My role does not exist for my spawnroom's memory");
			continue;
		}
		if(creep.ticksToLive == undefined) {
			// Spawning

			Memory.rooms[creep.memory.spawnRoom].role[creep.memory.role].current++;
			roles[creep.memory.role].run.run(creep);
			continue;
		}
		if((underAttack[creep.room.name] && !creep.memory.combat && creep.memory.role != "miner" && creep.memory.role != "upgrader") || creep.memory.role == 'towertender') {
			Memory.rooms[creep.memory.spawnRoom].role[creep.memory.role].current++;
			roles["towertender"].run.run(creep);
		}
		else if (creep.memory.setupTime != null) {
			if(creep.checkTimeToReplace() == false) {
				Memory.rooms[creep.memory.spawnRoom].role[creep.memory.role].current++;
			}
			roles[creep.memory.role].run.run(creep);
		} 
		else {
			if(roles[creep.memory.role] == null) {
				console.log("Warning: " + name + " has a bad role: " + creep.memory.role);
			} else {
				if((creep.ticksToLive - (creep.body.length * 3)) >= 0) {
					Memory.rooms[creep.memory.spawnRoom].role[creep.memory.role].current++;
				}
				roles[creep.memory.role].run.run(creep);
			}
		}
		if(creep.ticksToLive > 4) continue;

		if(creep.ticksToLive == 4) {
			creep.say("I regret",true);
		} else if(creep.ticksToLive == 3) {
			creep.say("nothing!",true);
		} else if(creep.ticksToLive == 2) {
			creep.say("RIP X_X", true);
		}
	}

	for(let room in Memory.rooms) {
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
							filter: (s) => s.hits != s.hitsMax && s.hits < 4000
					});
					if(structure != undefined) {
						tower.repair(structure);
					}
				}
			}
		}
	}
	for(spawn in Game.spawns) {
		Game.spawns[spawn].handlespawn(roles,underAttack[Game.spawns[spawn].room.name]);
	}
});
};
