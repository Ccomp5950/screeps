module.exports = function() {
    // create a new function for StructureSpawn
   	Source.prototype.isFree =
        function() {
                var opens = 0;
                var spawn = this;
                var offsets =   [[1,1],
                                 [1,0],
                                 [0,1],
                                 [-1,1],
                                 [1,-1],
                                 [-1,0],
                                 [-1,-1],
                                 [0,-1]
                                ];
                for(let offset of offsets) {
                        let xa = spawn.pos.x + offset[0];
                        let ya = spawn.pos.y + offset[1];
			console.log("xa and ya are (" + xa + ", "+ ya + ")");
                        let checkpos = new RoomPosition(xa, ya, spawn.room.name);
                        let terrain = checkpos.lookFor(OBSTACLE_OBJECT_TYPES);
                        if(terrain.length) {
                                continue;
                        }
                        return true;
                }
        return false;
        }
};
