module.exports = {
	generateWorld: generateWorld,
	randomNum: randomNum
};

const global_range = 1000;

const worldGenList = {
	'bob': {locs: ['desert', 'grasslands'], density: 6},
	'puddle': {locs: ['grasslands'], density: 2},
	'big_puddle': {locs: ['grasslands'], density: 1},
	'grass': {locs: ['grasslands'], density: 500},
	'sand': {locs: ['desert'], density: 500}
}

function generateWorld(nextId, entities, land) {
	generateLand(land);
	
	land.forEach(function(block) {
		for (const item in worldGenList) {
			var vals = worldGenList[item];
			if (vals.locs.includes(block.name)) {
				//var num = randomNum(vals.min, vals.max);
				var num = vals.density * (block.width * block.height) / 1000000;
				for (var i = 0; i < num; i++) {
					var x = randomNum(block.x1, block.x1 + block.width);
					var y = randomNum(block.y1, block.y1 + block.height);
					entities[nextId] = {
						name: item,
						x: x,
						y: y
					}
					nextId++;
				}				
			}
		}
	});

	return nextId;
}

function generateLand(land) {
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 2; j++) {
			var x = -1000 + 1000 * i;
			var y = -1000 + 1000 * j;
			var width = 1000;
			var height = 1000;
			var chosen = randomNum(0, 1);
			var name;
			var color;
			if (chosen == 0) {
				name = 'grasslands';
				color = '#b3ffb3';
			} else if (chosen == 1) {
				name = 'desert';
				color = '#ffa64d';
			}
			land.push({
				name: name,
				color: color,
				x1: x,
				y1: y,
				width: width,
				height: height
			});
		}
	}
	/*
	land.push({
		name: 'grasslands',
		color: '#b3ffb3',
		x1: -1000,
		y1: -1000,
		width: 2000,
		height: 2000
	});
	land.push({
		name: 'desert',
		color: '#ffa64d',
		x1: -1000,
		y1: -2000,
		width: 2000,
		height: 1000
	});
	*/
}

function randomNum(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}



