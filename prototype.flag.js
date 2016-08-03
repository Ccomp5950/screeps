module.exports = function() {
    // create a new function for StructureSpawn
	Flag.prototype.hasFetcher =
	function() {
		let flag = this;
		if(flag.memory.fetcher == null) {
			return false;
		} else {
			var creep = null;
			creep = Game.getObjectById(flag.memory.Fetcher);
			if(creep == null) {
				return false;
			}
		}
	return true;
	}
   	Flag.prototype.hasMiner =
        function() {
                let flag = this;
                if(flag.memory.miner == null) {
                        return false;
                } else {
                        var creep = null;
                        creep = Game.getObjectById(flag.memory.Miner);
                        if(creep == null) {
                                return false;
                        }
                }
	return true;
        };
        Flag.prototype.hasClaimer =
        function() {
                let flag = this;
                if(flag.memory.Claimer == null) {
                        return false;
                } else {
                        var creep = null;
                        creep = Game.getObjectById(flag.memory.Claimer);
                        if(creep == null) {
                                return false;
                        }
                }
        return true;
        };



        
};
