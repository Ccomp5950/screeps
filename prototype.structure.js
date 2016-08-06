module.exports = function() {
    // create a new function for StructureSpawn
   	Structure.prototype.isBeingRepaired =
        function(creep) {
		let s = this;
		if(Memory.structure == undefined) {
			Memory.structure = {};
		}
		if(Memory.structure[s.id] == undefined) {
			Memory.structure[s.id] = {};
		}
		if(Memory.structure[s.id].Repairer === undefined) {
			Memory.structure[s.id].Repairer = {repairerid: null, lastRepaired: -1}; 
		}
		let Smem = Memory.structure[s.id].Repairer;
		if(Smem.lastRepaired == -1) {
			return false;
		}
		if(Smem.lastRepaired < Game.time - 3) {
			Smem.repairerid = null;
			Smem.lastRepaired = -1;
			return false;
		}
		if(Smem.repairerid == creep.id) {
			return false;
		}
		return true;
        };
	Structure.prototype.setRepairer = 
	function(creep) {
		let s = this;
		let Smem = Memory.structure[s.id].Repairer;
		Smem.repairerid = creep.id;
		Smem.lastRepaired = Game.time;
		
	}
};