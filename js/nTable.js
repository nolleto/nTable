(function($) {

	$.fn.nTable = function(lines) {
		var table = new nTable(this);
		if (lines)
			table.create(lines);
		return table;
	}

	var nTable = function($this) {

		var settings = {
			animated: true,
			animationDuration: 250
		};
		var self = this;

		//Prototype ------------------------------------------------------------------------------------------------------------------------------------------------
		self.create = function(lines) {
			var columns = generateColumns(lines);

			var table = createTable($this);
			createThead(table, columns);
			createTbody(table, lines, columns);
		}

		self.refresh = function(lines) {
			$this.fadeOut(function() {
				self.create(lines);
				$this.fadeIn(animationDuration());
			}, animationDuration())
			
		}

		self.setSettings = function(set) {
			$.extend(settings, set);
		}

		//Verifications ------------------------------------------------------------------------------------------------------------------------------------------------
		function isAnimated() {
			return settings.animated;
		}

		function animationDuration() {
			return settings.animationDuration;
		}

		//Gerar HTML ------------------------------------------------------------------------------------------------------------------------------------------------
		function createTable(place) {
			place.find('table').remove();

			var data = {};
			var transform = [{
				tag: 'table',
				class: 'table table-bordered table-condensed'
			}];

			var table = json2html.transform(data, transform);
			place.append(table);

			return place.find('table');
		}

		function createThead(table, columns) {
			table.find('thead').remove();

			var data = {};
			var subTranform = [];

			for (var i = 0; i < columns.length; i++) {
				var column = columns[i];

				data['name' + i] = capitaliseFirstLetter(column['name']);
				subTranform.push({
					tag: 'th',
					html: '${name' + i + '}'
				});
			}

			var transform = [{
				tag: 'thead',
				children: [{
					tag: 'tr',
					children: subTranform
				}]
			}];

			var thead = json2html.transform(data, transform);
			table.prepend(thead);
		}

		function createTbody(table, lines, columns) {
			table.find('tbody').remove();

			var dataTr = [];
			var subTransformTr = [];

			var data = {};
			var transform = [{
				tag: 'tbody'
			}];

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];

				dataTr.push({});
				
				for (var j = 0; j < columns.length; j++) {
					var column = columns[j];

					dataTr[i]['name' + j] = line[column['name']];
					if (subTransformTr.length < columns.length) {
						subTransformTr.push({
							tag: 'td',
							html: '${name' + j + '}'
						});
					}
				}
			}
			var transformTr = [{
				tag: 'tr',
				children: subTransformTr
			}]
			
			var tbody = json2html.transform(data, transform);
			var tr = json2html.transform(dataTr, transformTr);

			table.append(tbody).find('tbody').append(tr);
		}

		//Funcoes ------------------------------------------------------------------------------------------------------------------------------------------------
		function generateColumns(lines) {
			var columns = [];
			var propts = [];
			if (!lines)
				return columns;
			
			var checkProptExist = function(propt) {
				for (var i = 0; i < propts.length; i++) {
					if (propts[i] == propt)
						return true;
				}
				return false;
			};

			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];

				for (var propt in line) {
					if (!checkProptExist(propt)) {
						propts.push(propt);
						var field = line[propt];
						columns.push({
							type: typeof(field),
							name: propt
						});
					}
				}
			}
			return columns;
		}

		function capitaliseFirstLetter(string) {
		    return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

	
	
})(jQuery);