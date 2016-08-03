module.exports = function() {
    // create a new function for StructureSpawn
	Flag.prototype.hasFetcher =
	function() {
		let flag = this;
		if(flag.memory.fetcher == null) {
			return false;
		} else {
			var creep = null;
			creep = Game.getObjectById(flag.memory.fetcher);
			if(creep == null) {
				return false;
			}
		}
	}
   	Flag.prototype.hasMiner =
        function() {
                let flag = this;
                if(flag.memory.miner == null) {
                        return false;
                } else {
                        var creep = null;
                        creep = Game.getObjectById(flag.memory.miner);
                        if(creep == null) {
                                return false;
                        }
                }
        };



        
};
