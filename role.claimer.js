module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
		if(creep.spawning) {
                        if(creep.memory.spawnTime == null) {
                                creep.memory.spawnTime = Game.time;
                        }
                        if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
                                creep.memory.myFlag = creep.findClaimingFlag();
                                if(creep.memory.myFlag != -1) {
                                        console.log("[" + creep.name + "] I'm grabbing the position at: " + creep.memory.myFlag);
                                        creep.claimClaimingFlag();
                                }

                        }
                        return;
                }


                if(creep.memory.myFlag == null || creep.memory.myFlag == -1) {
                        creep.memory.myFlag = creep.findClaimingFlag();
                        if(creep.memory.myFlag == -1) {
                                console.log("Claimer can't find a flag " + creep.name);
                                return;
                        }

                }


                let flag = Game.flags[creep.memory.myFlag];
                creep.claimClaimingFlag();
                if(flag != undefined) {
                        var range = creep.pos.getRangeTo(flag);
                        if(range > 0) {
                                creep.memory.setupTime = Game.time - creep.memory.spawnTime;
                                creep.moveTo(flag);
                                return;
                        }

                }

                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			filter: (s) => s.structureType == STRUCTURE_CONTROLER
		});
                if (target != undefined) {
                            if (creep.reserveController(target) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {maxRooms:1});
                                }
                return;
                }

        }
    
};
