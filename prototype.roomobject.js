module.exports = function() {
    // create a new function for StructureSpawn
	RoomObject.prototype.getIndexString =
	function() {
		let s = this;
		return s.pos.x.toString() + "_" + s.pos.y.toString();
	}

        RoomPosition.prototype.occupied =
        function(creep) {
		var ro = this;
                var finder = ro.pos.lookFor(LOOK_CREEPS);
                if(finder.length == 0) {
                        return false;
                }
		if(creep != null && finder[0].id = creep.id) {
			return false;
		}
        return true;
        };


};

