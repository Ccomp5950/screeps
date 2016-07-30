module.exports = function() {
    // create a new function for StructureSpawn
   	Source.prototype.hasSpace =
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
                        let xa = spawn.pos + offset[0];
                        let ya = spawn.pos + offset[1];
                        let checkpos = new RoomPosition(xa, ya, spawn.room);
                        let terrain = checkpos.lookFor(OBSTACLE_OBJECT_TYPES);
                        if(terrain.length) {
                                continue;
                        }
                        opens++;
                }
        return opens;
        }
};
