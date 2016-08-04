module.exports = {
    // a function to run the logic for this role
    run: function(creep, squadsize) {
		if(creep.spawning) {
			return;
		}
		/*
		if(creep.memory.squadsize == null) {
			creep.memory.raiding = false;
			creep.memory.ready = false;
			creep.memory.squadsize = squadsize;
		}
	
		if(creep.memory.ready == false && Game.flags["formup"] != undefined) {
                        var range = creep.pos.getRangeTo(Game.flags.formup);
                        if(range > 2) {
                                creep.moveTo(Game.flags.formup);
                                return;
                        } else if(Game.flags.formup.memory.squad.IndexOf(creep.id) == -1) {
					Game.flags.formup.memory.squad.Push(creep.id)
			}
		}
		if(creep.memory.ready == true) {
		*/
		creep.getAwayFromEdge();
		var flag = Game.flags.sapper;		
		var frange = 1;
		if(creep.hits == creep.hitsMax) {
			creep.memory.healing = false;
		}
		if(creep.hits < 1200 || creep.memory.healing == true) {
			creep.memory.healing = true;
			flag = Game.flags.sapperSafe;
			frange = 0;
		}
		if(flag != undefined) {
			var range = creep.pos.getRangeTo(flag);
			if(range > frange) {
				creep.moveTo(flag);
				return;
			}
		}
                if(creep.memory.healing) {
                        if(creep.heal(creep) == 0) {
                                return;
                        }
                }
                target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return;
                }
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, { 
							filter: (s) => s.structureType == STRUCTURE_TOWER
		});
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return;
                }
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                                                        filter: (s) => s.structureType != STRUCTURE_WALL
                });
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return;
                }

                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
							filter: (s) => s.structureType == STRUCTURE_WALL && s.hits < 199000
		});
		if (target == undefined) {
	                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                                      filter: (s) => s.structureType == STRUCTURE_WALL
	                });
		}
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return;
                }

                target = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES);
                if (target != undefined) {
                            if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                               }
                return;
                }

        }
    
};
