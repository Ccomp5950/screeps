module.exports = function() {
    // create a new function for StructureSpawn
   	Structure.prototype.isBeingRepaired =
        function(creep) {
		let s = this;
		if(Memory.structure === null) {
			Memory.structure == {};
		}
		if(Memory.structure.Repairer === null) {
			Memory.structure.Repairer = {};
			Memory.structure.Repairer[s.id] = {repairerid: null, lastRepaired: -1}: 
		}
		let Smem = Memory.structure.Repairer[s.id];
		if(Smem.lastRepared == -1) {
			return false;
		}
		if(Smem.lastRepaired < Game.time - 3) {
			Smem.repairerid = null;
			Smem.lastRepared = -1;
			return false;
		}
		if(Smem.repairerid == creep.id) {
			return false;
		}
		return true;
        };
	Structure.prototype.setRepair = 
	function(creep) {
		let s = this;
		let Smem = Memory.structure.Repairer[s.id];
		Smem.repairerid = creep.id;
		Smem.lastRepaired = Game.time();
		
	}
};
