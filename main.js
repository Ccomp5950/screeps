// import modules
require('prototype.spawn')();
require('prototype.creep')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallRepairer');
var roleTowerTender = require('role.towertender');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    var meanies = Game.rooms.E48S31.find(FIND_HOSTILE_CREEPS);
    var underAttack = false;
    if(meanies != undefined) {
	underAttack = true;
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

	if(underAttack || creep.memory.role = 'towertender') {
		roleTowerTender.run(creep);
	}
	

        // if creep is harvester, call harvester script
        else if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if creep is upgrader, call upgrader script
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if creep is builder, call builder script
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        // if creep is repairer, call repairer script
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        // if creep is wallRepairer, call wallRepairer script
        else if (creep.memory.role == 'wallRepairer') {
            roleWallRepairer.run(creep);
        }
    }

    var towers = Game.rooms.E48S31.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        }
    }

    // setup some minimum numbers for different roles
    var spawnInfinite = false;
    var minimumNumberOfHarvesters = 3;
    var minimumNumberOfUpgraders = 1;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 2;
    var minimumNumberOfWallRepairers = 0;
    var minimumNumberOfTowerTender = 0;

    // count the number of creeps alive for each role
    // _.sum will count the number of properties in Game.creeps filtered by the
    //  arrow function, which checks for the creep being a harvester
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallRepairer');
    var numberOfTowerTenders = _.sum(Game.creeps, (c) => c.memory.role == 'towertender');

    var energy = Game.spawns.Spawn1.room.energyCapacityAvailable;
    var name = undefined;
    var job = null;
    // if not enough harvesters
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
	job = "Harvester";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'harvester');

        // if spawning failed and we have no harvesters left
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            // spawn one with what is available
            name = Game.spawns.Spawn1.createCustomCreep(
                Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
    }
    // if not enough upgraders
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
	job = "Upgrader";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'upgrader');
    }
    // if not enough repairers
    else if (numberOfRepairers < minimumNumberOfRepairers) {
	job = "Repairer";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'repairer');
    }
    // if not enough builders
    else if (numberOfBuilders < minimumNumberOfBuilders) {
	job = "Builder";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    }
    // if not enough wallRepairers
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
	job = "Wall Repairer";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer');
    }
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        job = "Tower Tender";
        // try to spawn one
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'towertender');
    }
    else if (spawnInfinite) {
	job = "Builder";
        // else try to spawn a builder
        name = Game.spawns.Spawn1.createCustomCreep(energy, 'builder');
    }
   
    // print name to console if spawning was a success
    // name > 0 would not work since string > 0 returns false
    if (!(name < 0) && name != undefined) {
        console.log("Spawned new creep: " + name + " the " + job);
    }
};
