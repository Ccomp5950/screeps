module.exports = function() {
    // create a new function for StructureSpawn
	RoomObject.prototype.getIndexString =
	function() {
		let s = this;
		return s.pos.x.toString() + "_" + s.pos.y.toString();
		}
	}
};
